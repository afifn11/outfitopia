// tests/auth.test.ts
// Integration tests untuk endpoint kritis — jalankan: npm test

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import app from '../src/index.js';

// Mock database pool agar test tidak butuh MySQL asli
vi.mock('../src/config/db.js', () => {
  const mockPool = {
    query: vi.fn(),
    getConnection: vi.fn(),
  };
  return { default: mockPool };
});

// Mock email service agar test tidak kirim email sungguhan
vi.mock('../src/utils/emailService.js', () => ({
  sendWelcomeEmail: vi.fn().mockResolvedValue(undefined),
  sendEmail: vi.fn().mockResolvedValue(undefined),
}));

import pool from '../src/config/db.js';
const mockPool = pool as any;

// ─── Auth: Register ───────────────────────────────────────────────────────────

describe('POST /api/auth/register', () => {
  it('mengembalikan 400 jika field tidak lengkap', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com' }); // tanpa name & password
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('mengembalikan 400 jika format email tidak valid', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'bukan-email', password: '12345678' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('mengembalikan 400 jika password kurang dari 8 karakter', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@test.com', password: '123' });
    expect(res.status).toBe(400);
  });

  it('mengembalikan 400 jika email sudah terdaftar', async () => {
    // Simulasi: email sudah ada di DB
    mockPool.query.mockResolvedValueOnce([[{ id: 1 }]]);

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'exists@test.com', password: '12345678' });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('sudah terdaftar');
  });

  it('registrasi berhasil dan set HttpOnly cookie', async () => {
    // Email belum ada → insert berhasil
    mockPool.query
      .mockResolvedValueOnce([[]])                           // email belum ada
      .mockResolvedValueOnce([{ insertId: 42 }]);            // insert user

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Afif', email: 'afif@test.com', password: '12345678' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('afif@test.com');
    expect(res.body.data.token).toBeDefined();
    // Pastikan cookie di-set
    expect(res.headers['set-cookie']).toBeDefined();
    const cookie = (res.headers['set-cookie'] as string[])[0];
    expect(cookie).toContain('HttpOnly');
  });
});

// ─── Auth: Login ──────────────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {
  it('mengembalikan 400 jika email atau password kosong', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com' });
    expect(res.status).toBe(400);
  });

  it('mengembalikan 400 jika email tidak ditemukan', async () => {
    mockPool.query.mockResolvedValueOnce([[]]); // user tidak ada
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'notfound@test.com', password: '12345678' });
    expect(res.status).toBe(400);
    // Pesan generik — tidak mengungkap apakah email ada atau tidak
    expect(res.body.message).toBe('Email atau password salah');
  });

  it('mengembalikan 400 jika password salah', async () => {
    mockPool.query.mockResolvedValueOnce([[{
      id: 1, email: 'afif@test.com', role: 'user',
      // bcrypt hash untuk 'correctpassword'
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J4rOmQ8Zy',
    }]]);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'afif@test.com', password: 'wrongpassword' });
    expect(res.status).toBe(400);
  });
});

// ─── Auth: Logout ─────────────────────────────────────────────────────────────

describe('POST /api/auth/logout', () => {
  it('menghapus cookie dan mengembalikan success', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

// ─── Orders: Create ───────────────────────────────────────────────────────────

describe('POST /api/orders', () => {
  it('mengembalikan 401 jika tidak terautentikasi', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ cartItems: [], totalPrice: 100000 });
    expect(res.status).toBe(401);
  });

  it('mengembalikan 400 jika cartItems kosong', async () => {
    // Gunakan valid JWT untuk test ini
    process.env['JWT_SECRET'] = 'test-secret-key';
    const jwt = await import('jsonwebtoken');
    const token = jwt.default.sign({ id: 1, role: 'user' }, 'test-secret-key');

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userDetails: { name: 'Test', phone: '08123456789', address: 'Jl. Test No. 1' },
        cartItems: [],  // kosong — harus gagal
        totalPrice: 0,
      });
    expect(res.status).toBe(400);
  });
});

// ─── Products: Public ─────────────────────────────────────────────────────────

describe('GET /api/products', () => {
  it('mengembalikan list produk dengan pagination', async () => {
    mockPool.query
      .mockResolvedValueOnce([[{ total: 25 }]])   // count query
      .mockResolvedValueOnce([Array(12).fill({    // data query
        id: 1, name: 'Test', price: 100000,
        sizes: 'S,M,L', is_featured: false,
        average_rating: 4.5, num_reviews: 10,
      })]);

    const res = await request(app).get('/api/products?page=1&limit=12');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.products).toHaveLength(12);
    expect(res.body.data.totalPages).toBe(3);
    expect(res.body.data.totalProducts).toBe(25);
  });

  it('sizes di-parse menjadi array', async () => {
    mockPool.query
      .mockResolvedValueOnce([[{ total: 1 }]])
      .mockResolvedValueOnce([[{ id: 1, name: 'Kaos', price: 50000, sizes: 'S,M,L,XL' }]]);

    const res = await request(app).get('/api/products');
    expect(res.body.data.products[0].sizes).toEqual(['S', 'M', 'L', 'XL']);
  });
});

describe('GET /health', () => {
  it('mengembalikan status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
