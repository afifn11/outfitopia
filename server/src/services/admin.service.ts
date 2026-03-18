// src/services/admin.service.ts
import pool from '../config/db.js';
import { NotFoundError, AppError } from '../middleware/errorHandler.js';
import { invalidateProductCache } from './product.service.js';
import type { CreateProductInput } from '../utils/validators.js';

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const getDashboardStats = async () => {
  // Gunakan Promise.all untuk parallel queries — tidak sequential
  const [
    [productCount],
    [orderCount],
    [reviewCount],
    [revenueData],
    [orderStats],
    [recentOrders],
    [recentReviews],
  ] = await Promise.all([
    pool.query<any[]>('SELECT COUNT(*) as count FROM products'),
    pool.query<any[]>('SELECT COUNT(*) as count FROM orders'),
    pool.query<any[]>('SELECT COUNT(*) as count FROM reviews'),
    pool.query<any[]>(`SELECT SUM(total_amount) as total FROM orders WHERE status = 'Completed'`),
    pool.query<any[]>(`SELECT status, COUNT(*) as count FROM orders GROUP BY status`),
    pool.query<any[]>(`
      SELECT o.*, u.name as userName, u.email as userEmail
      FROM orders o JOIN users u ON o.user_id = u.id
      ORDER BY o.order_date DESC LIMIT 5
    `),
    pool.query<any[]>(`
      SELECT r.id, r.rating, r.comment, r.created_at,
             p.name as productName, u.name as userName
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC LIMIT 5
    `),
  ]);

  const statusMap = { pending: 0, shipped: 0, completed: 0, cancelled: 0 } as Record<string, number>;
  for (const s of orderStats as any[]) {
    const key = (s.status as string).toLowerCase();
    if (key in statusMap) statusMap[key] = s.count as number;
  }

  return {
    totalProducts: (productCount as any[])[0].count,
    totalOrders: (orderCount as any[])[0].count,
    totalReviews: (reviewCount as any[])[0].count,
    totalRevenue: (revenueData as any[])[0].total ?? 0,
    orderStats: statusMap,
    recentOrders: recentOrders,
    recentReviews: recentReviews,
  };
};

// ─── Products ─────────────────────────────────────────────────────────────────

const updateProductCategories = async (conn: any, productId: number, categoryIds: number[]) => {
  await conn.query('DELETE FROM product_categories WHERE product_id = ?', [productId]);
  if (categoryIds.length > 0) {
    const values = categoryIds.map((cid) => [productId, cid]);
    await conn.query('INSERT INTO product_categories (product_id, category_id) VALUES ?', [values]);
  }
};

export const createProduct = async (input: CreateProductInput): Promise<{ id: number }> => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const sizesString = input.sizes?.join(',') ?? '';
    const [result] = await conn.query<any>(
      'INSERT INTO products (name, price, description, image, sizes, is_featured) VALUES (?, ?, ?, ?, ?, ?)',
      [input.name, input.price, input.description, input.image, sizesString, input.is_featured],
    );
    const productId: number = (result as any).insertId;
    await updateProductCategories(conn, productId, input.category_ids ?? []);
    await conn.commit();
    invalidateProductCache();
    return { id: productId };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const updateProduct = async (id: number, input: CreateProductInput): Promise<void> => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [existing] = await conn.query<any[]>('SELECT id FROM products WHERE id = ?', [id]);
    if ((existing as any[]).length === 0) throw new NotFoundError('Produk');

    const sizesString = input.sizes?.join(',') ?? '';
    await conn.query(
      'UPDATE products SET name=?, price=?, description=?, image=?, sizes=?, is_featured=? WHERE id=?',
      [input.name, input.price, input.description, input.image, sizesString, input.is_featured, id],
    );
    await updateProductCategories(conn, id, input.category_ids ?? []);
    await conn.commit();
    invalidateProductCache();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [existing] = await conn.query<any[]>('SELECT id FROM products WHERE id = ?', [id]);
    if ((existing as any[]).length === 0) throw new NotFoundError('Produk');
    await conn.query('DELETE FROM product_categories WHERE product_id = ?', [id]);
    await conn.query('DELETE FROM products WHERE id = ?', [id]);
    await conn.commit();
    invalidateProductCache();
  } catch (err) {
    await conn.rollback();
    if ((err as any).code === 'ER_ROW_IS_REFERENCED_2') {
      throw new AppError('Tidak dapat menghapus produk yang sudah memiliki pesanan atau ulasan.', 400);
    }
    throw err;
  } finally {
    conn.release();
  }
};

// ─── Orders & Reviews ─────────────────────────────────────────────────────────

export const getAllOrders = async () => {
  const [rows] = await pool.query<any[]>(`
    SELECT o.*, u.name as userName, u.email as userEmail
    FROM orders o JOIN users u ON o.user_id = u.id
    ORDER BY o.order_date DESC
  `);
  return rows;
};

export const getAllReviews = async () => {
  const [rows] = await pool.query<any[]>(`
    SELECT r.id, r.rating, r.comment, r.created_at,
           p.name as productName, u.name as userName
    FROM reviews r
    JOIN products p ON r.product_id = p.id
    JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC
  `);
  return rows;
};

export const deleteReview = async (id: number): Promise<void> => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [existing] = await conn.query<any[]>(
      'SELECT product_id FROM reviews WHERE id = ?', [id],
    );
    if ((existing as any[]).length === 0) throw new NotFoundError('Ulasan');
    const productId: number = (existing as any[])[0].product_id;

    await conn.query('DELETE FROM reviews WHERE id = ?', [id]);
    await conn.query(
      `UPDATE products SET
         num_reviews = (SELECT COUNT(*) FROM reviews WHERE product_id = ?),
         average_rating = COALESCE((SELECT AVG(rating) FROM reviews WHERE product_id = ?), 0)
       WHERE id = ?`,
      [productId, productId, productId],
    );
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const getAllUsers = async () => {
  const [rows] = await pool.query<any[]>(`
    SELECT u.id, u.name, u.email, u.created_at,
           COUNT(DISTINCT o.id) as total_orders,
           COALESCE(SUM(CASE WHEN o.status='Completed' THEN o.total_amount ELSE 0 END), 0) as total_spent
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    WHERE u.role != 'admin'
    GROUP BY u.id, u.name, u.email, u.created_at
    ORDER BY u.created_at DESC
  `);
  return rows;
};
