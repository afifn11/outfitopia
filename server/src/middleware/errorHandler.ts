// src/middleware/errorHandler.ts
// Centralized error handler — semua error akhirnya sampai ke sini

import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true,
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} tidak ditemukan`, 404);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Tidak terautentikasi') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

// Global error handler — harus dipasang TERAKHIR di index.ts
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Log semua error di server (bukan ke client)
  console.error(`[${req.method}] ${req.path} →`, err.message);
  if (process.env['NODE_ENV'] !== 'production') {
    console.error(err.stack);
  }

  // AppError: operational error yang kita throw sendiri
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // MySQL duplicate entry
  if ((err as NodeJS.ErrnoException).code === 'ER_DUP_ENTRY') {
    res.status(400).json({
      success: false,
      message: 'Data sudah ada. Periksa kembali input Anda.',
    });
    return;
  }

  // Unexpected error — jangan expose detail ke production
  res.status(500).json({
    success: false,
    message: process.env['NODE_ENV'] === 'production'
      ? 'Terjadi kesalahan server.'
      : err.message,
  });
};

// 404 handler untuk route yang tidak ditemukan
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} tidak ditemukan`,
  });
};
