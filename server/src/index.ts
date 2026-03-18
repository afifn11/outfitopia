// src/index.ts
// REFACTOR: CORS proper, cookie-parser, centralized error handler, TypeScript

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import adminRoutes from './routes/admin.routes.js';
import reviewRoutes from './routes/review.routes.js';
import categoryRoutes from './routes/category.routes.js';

const app = express();

// ─── Security & Parsing Middleware ────────────────────────────────────────────

// REFACTOR: CORS dikonfigurasi dengan whitelist — bukan app.use(cors())
app.use(cors({
  origin: process.env['FRONTEND_URL'] ?? 'http://localhost:5173',
  credentials: true, // diperlukan agar cookie bisa dikirim cross-origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // REFACTOR: untuk baca HttpOnly cookie dari request

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/categories', categoryRoutes);

// ─── Error Handling (harus di PALING BAWAH) ───────────────────────────────────

app.use(notFoundHandler);
app.use(errorHandler);

// ─── Server Start ─────────────────────────────────────────────────────────────

const PORT = Number(process.env['PORT']) || 5000;

if (process.env['NODE_ENV'] !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env['NODE_ENV'] ?? 'development'}`);
  });
}

export default app; // export untuk testing
