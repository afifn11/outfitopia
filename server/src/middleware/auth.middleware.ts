// src/middleware/auth.middleware.ts
// REFACTOR: Mendukung HttpOnly cookie (lebih aman dari localStorage)
// Tetap backward-compatible dengan Bearer token untuk transisi

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/index.js';

// Extend Express Request agar req.user tersedia secara type-safe
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const getTokenFromRequest = (req: Request): string | null => {
  // Prioritas 1: HttpOnly cookie (lebih aman)
  const cookieToken = req.cookies?.token as string | undefined;
  if (cookieToken) return cookieToken;

  // Prioritas 2: Authorization header (untuk backward-compat & API client)
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.split(' ')[1] ?? null;
  }

  return null;
};

export const protect = (req: Request, res: Response, next: NextFunction): void => {
  const token = getTokenFromRequest(req);

  if (!token) {
    res.status(401).json({ success: false, message: 'Tidak terautentikasi. Silakan login.' });
    return;
  }

  try {
    const secret = process.env['JWT_SECRET'];
    if (!secret) throw new Error('JWT_SECRET tidak dikonfigurasi');

    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    // Jangan expose detail error ke client
    res.status(401).json({ success: false, message: 'Token tidak valid atau sudah kedaluwarsa.' });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Tidak terautentikasi.' });
    return;
  }
  if (req.user.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Akses ditolak. Hanya admin yang diizinkan.' });
    return;
  }
  next();
};
