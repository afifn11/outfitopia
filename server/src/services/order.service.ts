// src/services/order.service.ts
// Business logic order — semua database logic di sini, controller jadi tipis

import pool from '../config/db.js';
import { AppError, NotFoundError } from '../middleware/errorHandler.js';
import type { CreateOrderInput } from '../utils/validators.js';
import type { Order, OrderStatus } from '../types/index.js';

export const createOrder = async (userId: number, input: CreateOrderInput): Promise<{ orderId: number }> => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [orderResult] = await conn.query<any>(
      `INSERT INTO orders 
       (user_id, total_amount, shipping_address, customer_name, customer_phone) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        userId,
        input.totalPrice,
        input.userDetails.address,
        input.userDetails.name,
        input.userDetails.phone,
      ],
    );
    const orderId: number = (orderResult as any).insertId;

    // Insert semua order items secara parallel
    await Promise.all(
      input.cartItems.map((item) =>
        conn.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price, size) VALUES (?, ?, ?, ?, ?)',
          [orderId, item.id, item.quantity, item.price, item.selectedSize],
        ),
      ),
    );

    await conn.commit();
    return { orderId };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const getMyOrders = async (userId: number): Promise<Order[]> => {
  const [rows] = await pool.query<any[]>(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC',
    [userId],
  );
  return rows as Order[];
};

export const getOrderById = async (orderId: number, userId: number) => {
  const [orderRows] = await pool.query<any[]>(
    'SELECT * FROM orders WHERE id = ? AND user_id = ?',
    [orderId, userId],
  );
  if ((orderRows as any[]).length === 0) {
    throw new NotFoundError('Pesanan');
  }

  const [items] = await pool.query<any[]>(
    `SELECT oi.*, p.name as productName, p.image as productImage
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = ?`,
    [orderId],
  );

  return { order: (orderRows as any[])[0] as Order, items: items as any[] };
};

export const updateOrderStatus = async (orderId: number, status: OrderStatus) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [existing] = await conn.query<any[]>(
      'SELECT id, status FROM orders WHERE id = ?',
      [orderId],
    );
    if ((existing as any[]).length === 0) throw new NotFoundError('Pesanan');

    const currentStatus = (existing as any[])[0].status as OrderStatus;
    if (currentStatus === status) {
      throw new AppError('Status pesanan sudah sama', 400);
    }

    await conn.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);

    // Ambil customer info untuk email notifikasi
    const [orderData] = await conn.query<any[]>(
      `SELECT o.id, o.total_amount, u.email, u.name
       FROM orders o JOIN users u ON o.user_id = u.id
       WHERE o.id = ?`,
      [orderId],
    );

    await conn.commit();
    return { customer: (orderData as any[])[0] };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};
