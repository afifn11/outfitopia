// src/services/review.service.ts
import pool from '../config/db.js';
import { AppError, NotFoundError } from '../middleware/errorHandler.js';
import type { CreateReviewInput } from '../utils/validators.js';

export const getProductReviews = async (productId: number) => {
  const [rows] = await pool.query<any[]>(
    `SELECT r.*, u.name as userName 
     FROM reviews r 
     JOIN users u ON r.user_id = u.id 
     WHERE r.product_id = ? 
     ORDER BY r.created_at DESC`,
    [productId],
  );
  return rows;
};

export const createProductReview = async (
  productId: number,
  userId: number,
  input: CreateReviewInput,
): Promise<void> => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Validasi: user harus pernah beli & terima produk ini
    const [purchase] = await conn.query<any[]>(
      `SELECT o.id FROM orders o 
       JOIN order_items oi ON o.id = oi.order_id 
       WHERE o.user_id = ? AND oi.product_id = ? 
         AND o.status IN ('Shipped', 'Completed')`,
      [userId, productId],
    );
    if ((purchase as any[]).length === 0) {
      throw new AppError('Anda hanya bisa memberi ulasan untuk produk yang sudah diterima.', 403);
    }

    // Cek apakah sudah pernah review
    const [existing] = await conn.query<any[]>(
      'SELECT id FROM reviews WHERE user_id = ? AND product_id = ?',
      [userId, productId],
    );
    if ((existing as any[]).length > 0) {
      throw new AppError('Produk sudah pernah Anda ulas.', 400);
    }

    await conn.query(
      'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
      [productId, userId, input.rating, input.comment ?? null],
    );

    // Update agregat rating di tabel products
    await conn.query(
      `UPDATE products p SET
         p.num_reviews = (SELECT COUNT(*) FROM reviews r WHERE r.product_id = ?),
         p.average_rating = (SELECT AVG(r.rating) FROM reviews r WHERE r.product_id = ?)
       WHERE p.id = ?`,
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

// Tambahkan ke validators.ts — export type helper
declare module '../utils/validators.js' {
  export type CreateReviewInput = {
    rating: number;
    comment?: string;
  };
}
