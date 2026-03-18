// src/services/auth.service.ts
// Business logic auth — dipisah dari controller agar mudah di-test

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';
import { sendWelcomeEmail } from '../utils/emailService.js';
import type { JwtPayload, PublicUser, User } from '../types/index.js';
import type { RegisterInput, LoginInput } from '../utils/validators.js';

const COOKIE_OPTIONS = {
  httpOnly: true,                                          // JS tidak bisa baca
  secure: process.env['NODE_ENV'] === 'production',        // HTTPS only di production
  sameSite: 'strict' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000,                       // 30 hari
};

const generateToken = (id: number, role: 'user' | 'admin'): string => {
  const secret = process.env['JWT_SECRET'];
  if (!secret) throw new Error('JWT_SECRET tidak dikonfigurasi');
  return jwt.sign({ id, role } satisfies JwtPayload, secret, { expiresIn: '30d' });
};

export const registerUser = async (input: RegisterInput): Promise<{ user: PublicUser; token: string; cookieOptions: typeof COOKIE_OPTIONS }> => {
  // Cek apakah email sudah terdaftar
  const [existing] = await pool.query<any[]>(
    'SELECT id FROM users WHERE email = ?',
    [input.email],
  );
  if ((existing as any[]).length > 0) {
    throw new AppError('Email sudah terdaftar', 400);
  }

  const hashedPassword = await bcrypt.hash(input.password, 12);

  const [result] = await pool.query<any>(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [input.name, input.email, hashedPassword],
  );

  const newUser: PublicUser = {
    id: (result as any).insertId,
    name: input.name,
    email: input.email,
    role: 'user',
    created_at: new Date(),
  };

  // Kirim welcome email secara non-blocking — tidak gagalkan registrasi
  void sendWelcomeEmail(newUser.email, newUser.name).catch((err: Error) => {
    console.error('Welcome email gagal dikirim:', err.message);
  });

  const token = generateToken(newUser.id, newUser.role);
  return { user: newUser, token, cookieOptions: COOKIE_OPTIONS };
};

export const loginUser = async (input: LoginInput): Promise<{ user: PublicUser; token: string; cookieOptions: typeof COOKIE_OPTIONS }> => {
  const [rows] = await pool.query<any[]>(
    'SELECT * FROM users WHERE email = ?',
    [input.email],
  );
  const users = rows as User[];
  const user = users[0];

  if (!user) {
    // Pesan error yang sama untuk email/password salah — cegah user enumeration
    throw new AppError('Email atau password salah', 400);
  }

  const isMatch = await bcrypt.compare(input.password, user.password);
  if (!isMatch) {
    throw new AppError('Email atau password salah', 400);
  }

  const publicUser: PublicUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
  };

  const token = generateToken(user.id, user.role);
  return { user: publicUser, token, cookieOptions: COOKIE_OPTIONS };
};
