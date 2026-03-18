// src/utils/validators.ts
// Centralized Zod schemas — semua input validation ada di sini

import { z } from 'zod';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});

export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Password tidak boleh kosong'),
});

// ─── Order ────────────────────────────────────────────────────────────────────

export const createOrderSchema = z.object({
  userDetails: z.object({
    name: z.string().min(1, 'Nama tidak boleh kosong'),
    phone: z.string().min(8, 'Nomor telepon tidak valid'),
    address: z.string().min(10, 'Alamat terlalu singkat'),
  }),
  cartItems: z.array(
    z.object({
      id: z.number().int().positive(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
      selectedSize: z.string().min(1),
    })
  ).min(1, 'Keranjang tidak boleh kosong'),
  totalPrice: z.number().positive('Total harga harus lebih dari 0'),
});

// ─── Review ───────────────────────────────────────────────────────────────────

export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

// ─── Product (Admin) ──────────────────────────────────────────────────────────

export const createProductSchema = z.object({
  name: z.string().min(1, 'Nama produk tidak boleh kosong').max(255),
  price: z.number().positive('Harga harus lebih dari 0'),
  description: z.string().min(1, 'Deskripsi tidak boleh kosong'),
  image: z.string().url('URL gambar tidak valid'),
  sizes: z.array(z.string()).optional().default([]),
  is_featured: z.boolean().optional().default(false),
  category_ids: z.array(z.number().int().positive()).optional().default([]),
});

export const updateProductSchema = createProductSchema;

export const updateOrderStatusSchema = z.object({
  status: z.enum(['Pending', 'Shipped', 'Completed', 'Cancelled']),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
