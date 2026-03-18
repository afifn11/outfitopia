# Outfitopia — Refactor Guide

Panduan lengkap untuk menjalankan dan mengaplikasikan semua perubahan refactor ke project Outfitopia.

## Apa yang berubah

| Aspek | Sebelum | Sesudah |
|---|---|---|
| Bahasa | JavaScript plain | TypeScript strict |
| Auth storage | localStorage (rentan XSS) | HttpOnly cookie (aman) |
| CORS | `app.use(cors())` — terbuka | Whitelist domain spesifik |
| Arsitektur | Fat controller | Controller → Service layer |
| Validasi | `if (!name \|\| !email)` | Zod schema |
| Error handling | Per-route try/catch | Global error handler |
| Caching | Tidak ada | node-cache untuk featured/bestselling |
| Query N+1 | 2 query di getProductById | 1 query JOIN |
| Testing | Tidak ada | Vitest + Supertest |
| CI/CD | Tidak ada | GitHub Actions |

---

## Setup lokal dari nol

### Prasyarat

- Node.js 20+ → https://nodejs.org
- MySQL 8+ → https://dev.mysql.com/downloads/
- Git

### Langkah 1 — Clone dan siapkan folder

```bash
# Clone repo kamu
git clone https://github.com/afifn11/outfitopia.git
cd outfitopia
```

### Langkah 2 — Setup database MySQL

Buka MySQL Workbench atau terminal MySQL, lalu:

```sql
CREATE DATABASE outfitopia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE outfitopia;

-- Jalankan schema SQL kamu (dari file yang ada di project)
-- SOURCE path/to/schema.sql;
```

### Langkah 3 — Setup environment variables server

```bash
cd server
cp .env.example .env
```

Buka `.env` dan isi:

```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password_mysql_kamu
DB_NAME=outfitopia
JWT_SECRET=jalankan_perintah_di_bawah_untuk_generate
FRONTEND_URL=http://localhost:5173
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=isi_dari_mailtrap
SMTP_PASS=isi_dari_mailtrap
```

Generate JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Langkah 4 — Install dependencies server

```bash
cd server
npm install
```

### Langkah 5 — Jalankan server (development)

```bash
npm run dev
# Output: ✅ MySQL connected successfully
#         🚀 Server running on http://localhost:5000
```

### Langkah 6 — Setup client

```bash
cd ../client
npm install
```

Buat file `.env.local` di folder `client/`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Langkah 7 — Jalankan client

```bash
npm run dev
# Buka: http://localhost:5173
```

---

## Mengaplikasikan file refactor ke project

Semua file sudah siap di folder ini. Ikuti urutan berikut:

### Prioritas 1 — Server: struktur baru

Ganti seluruh folder `server/` dengan struktur baru:

```
server/
├── src/
│   ├── config/
│   │   └── db.ts                    ← ganti config/db.js
│   ├── controllers/
│   │   ├── auth.controller.ts       ← ganti controllers/authController.js
│   │   ├── product.controller.ts    ← ganti controllers/productController.js
│   │   ├── order.controller.ts      ← ganti controllers/orderController.js
│   │   ├── admin.controller.ts      ← ganti controllers/adminController.js
│   │   ├── review.controller.ts     ← ganti controllers/reviewController.js
│   │   └── category.controller.ts   ← ganti controllers/categoryController.js
│   ├── services/                    ← BARU — business logic dipindahkan ke sini
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   ├── order.service.ts
│   │   ├── admin.service.ts
│   │   └── review.service.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts       ← ganti middleware/authMiddleware.js
│   │   └── errorHandler.ts         ← BARU — global error handler
│   ├── routes/
│   │   ├── auth.routes.ts           ← ganti routes/authRoutes.js
│   │   ├── product.routes.ts        ← ganti routes/productRoutes.js
│   │   ├── order.routes.ts          ← ganti routes/orderRoutes.js
│   │   ├── admin.routes.ts          ← ganti routes/adminRoutes.js
│   │   ├── review.routes.ts         ← ganti routes/reviewRoutes.js
│   │   └── category.routes.ts       ← ganti routes/categoryRoutes.js
│   ├── types/
│   │   └── index.ts                 ← BARU — semua TypeScript types
│   ├── utils/
│   │   ├── validators.ts            ← BARU — Zod schemas
│   │   └── emailService.ts         ← ganti utils/emailService.js
│   └── index.ts                    ← ganti index.js
├── tests/
│   └── auth.test.ts                ← BARU — integration tests
├── package.json                    ← update dengan dependencies baru
├── tsconfig.json                   ← BARU
├── vitest.config.ts                ← BARU
└── .env.example                    ← update
```

### Prioritas 2 — Client: file yang perlu diupdate

```
client/src/
├── context/
│   └── AuthContext.tsx   ← ganti AuthContext.jsx (hapus localStorage)
├── services/
│   └── api.ts            ← ganti api.js (tambah withCredentials)
└── types/
    └── index.ts          ← BARU — shared TypeScript types
```

Untuk file client lain (pages, components), rename `.jsx` → `.tsx` secara bertahap.

### Prioritas 3 — CI/CD

```bash
mkdir -p .github/workflows
# Salin file ci.yml ke .github/workflows/ci.yml
```

---

## Menjalankan tests

```bash
cd server
npm test

# Output yang diharapkan:
# ✓ POST /api/auth/register > mengembalikan 400 jika field tidak lengkap
# ✓ POST /api/auth/register > mengembalikan 400 jika email sudah terdaftar
# ✓ POST /api/auth/register > registrasi berhasil dan set HttpOnly cookie
# ... (15 tests total)
```

Cek coverage:

```bash
npm run test:coverage
```

---

## Debugging masalah umum

### Error: Cannot find module 'mysql2'

```bash
cd server && npm install
```

### Error: MySQL ECONNREFUSED

Pastikan MySQL jalan:
```bash
# macOS
brew services start mysql

# Windows — buka Services, start MySQL
# Linux
sudo systemctl start mysql
```

Cek koneksi:
```bash
mysql -u root -p -e "SHOW DATABASES;"
```

### Error: JWT_SECRET tidak dikonfigurasi

Pastikan file `.env` ada di folder `server/` (bukan di root project) dan sudah terisi.

### CORS error di browser

Pastikan `FRONTEND_URL` di `.env` server sama persis dengan URL frontend kamu:
```env
FRONTEND_URL=http://localhost:5173   # ← harus sama dengan address Vite
```

### Cookie tidak terkirim

Di development (HTTP, bukan HTTPS), pastikan:
- `secure: false` di cookie options server (sudah di-handle otomatis via `NODE_ENV`)
- `withCredentials: true` di `api.ts` client
- CORS server punya `credentials: true`

---

## Checklist refactor selesai

- [ ] Server berjalan dengan `npm run dev` tanpa error
- [ ] Client berjalan dengan `npm run dev` dan bisa akses server
- [ ] Login berhasil dan cookie ter-set (cek DevTools → Application → Cookies)
- [ ] localStorage sudah tidak ada token/user (cek DevTools → Application → Local Storage)
- [ ] `npm test` semua pass
- [ ] `npm run type-check` tanpa error
- [ ] `npm run build` berhasil
- [ ] GitHub Actions CI berjalan hijau setelah push
- [ ] CI badge ditambahkan ke README.md utama

---

## Langkah selanjutnya setelah refactor server selesai

1. **Migrasi client `.jsx` → `.tsx`** — mulai dari komponen terkecil (Footer, Navbar), lalu pages
2. **Tambahkan React Query** (TanStack Query) untuk data fetching yang lebih proper dengan cache
3. **Deploy** — Railway untuk server (support Node.js + env vars), Vercel untuk client

---

*Dibuat sebagai bagian dari refactor portofolio Outfitopia — Muhammad Afif Naufal*
