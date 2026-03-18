-- ============================================================
-- Outfitopia — Seed Data
-- Jalankan SETELAH schema.sql:
--   mysql -u root -p outfitopia < seed.sql
-- ============================================================

USE outfitopia;

-- ─── Admin & Demo Users ──────────────────────────────────────
-- Password semua akun: password123
-- Hash bcrypt (cost 12) untuk "password123"

INSERT INTO users (name, email, password, role) VALUES
  ('Admin Outfitopia', 'admin@outfitopia.com',
   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewFBPj/VNI0F6Xm6', 'admin'),
  ('Afif Naufal',      'afif@outfitopia.com',
   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewFBPj/VNI0F6Xm6', 'user'),
  ('Siti Rahayu',      'siti@outfitopia.com',
   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewFBPj/VNI0F6Xm6', 'user'),
  ('Budi Santoso',     'budi@outfitopia.com',
   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewFBPj/VNI0F6Xm6', 'user');

-- ─── Categories ──────────────────────────────────────────────

INSERT INTO categories (name, slug) VALUES
  ('T-Shirts',  't-shirts'),
  ('Shirts',    'shirts'),
  ('Trousers',  'trousers'),
  ('Outerwear', 'outerwear'),
  ('Dresses',   'dresses'),
  ('Knitwear',  'knitwear'),
  ('Accessories', 'accessories');

-- ─── Products ────────────────────────────────────────────────
-- Menggunakan gambar dari Unsplash (free, no key required)

INSERT INTO products (name, price, description, image, sizes, is_featured, average_rating, num_reviews, stock) VALUES
  (
    'Essential White Tee',
    189000,
    'Kaos putih bersih berbahan 100% cotton combed 30s. Potongan regular fit yang nyaman untuk aktivitas sehari-hari. Tersedia dalam berbagai ukuran.',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    'XS,S,M,L,XL,XXL', 1, 4.50, 24, 150
  ),
  (
    'Oversized Linen Shirt',
    459000,
    'Kemeja linen premium dengan potongan oversized modern. Material breathable yang sempurna untuk cuaca tropis Indonesia.',
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80',
    'S,M,L,XL', 1, 4.70, 18, 80
  ),
  (
    'Straight Leg Trousers',
    549000,
    'Celana panjang straight leg berbahan twill premium. Potongan clean dan modern, cocok dipadukan dengan berbagai atasan.',
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80',
    'XS,S,M,L,XL', 1, 4.30, 15, 60
  ),
  (
    'Minimal Trench Coat',
    1299000,
    'Trench coat dengan siluet modern dan bersih. Terbuat dari bahan water-resistant berkualitas tinggi. Statement piece untuk koleksi kamu.',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
    'XS,S,M,L', 1, 4.80, 31, 40
  ),
  (
    'Slip Dress',
    389000,
    'Slip dress berbahan satin matte yang jatuh elegan. Desain minimalis yang bisa dipakai ke berbagai kesempatan.',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
    'XS,S,M,L', 1, 4.60, 22, 55
  ),
  (
    'Ribbed Knit Sweater',
    529000,
    'Sweater rajut ribbed dengan tekstur halus. Material wool blend yang hangat namun tetap ringan di badan.',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80',
    'XS,S,M,L,XL', 1, 4.40, 19, 70
  ),
  (
    'Wide Leg Pants',
    499000,
    'Celana wide leg dengan potongan tinggi yang flattering. Material crepe premium yang tidak mudah kusut.',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
    'XS,S,M,L', 0, 4.20, 11, 45
  ),
  (
    'Fitted Blazer',
    849000,
    'Blazer single-breasted dengan potongan fitted modern. Cocok untuk tampilan profesional maupun kasual chic.',
    'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&q=80',
    'XS,S,M,L,XL', 1, 4.90, 27, 35
  ),
  (
    'Crew Neck Tee',
    169000,
    'Kaos crew neck classic berbahan cotton-modal blend yang lembut. Potongan slightly relaxed untuk kenyamanan maksimal.',
    'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80',
    'XS,S,M,L,XL,XXL', 0, 4.10, 9, 200
  ),
  (
    'Oxford Button-Down',
    429000,
    'Kemeja oxford klasik dengan detail button-down collar. Material cotton Oxford yang nyaman dan mudah dirawat.',
    'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&q=80',
    'S,M,L,XL', 0, 4.50, 14, 65
  ),
  (
    'Wrap Midi Dress',
    469000,
    'Midi dress dengan siluet wrap yang feminin. Bahan viscose premium yang jatuh cantik mengikuti lekuk tubuh.',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80',
    'XS,S,M,L', 0, 4.30, 16, 50
  ),
  (
    'Canvas Tote Bag',
    249000,
    'Tote bag canvas premium berkapasitas besar. Tali yang diperkuat untuk membawa beban berat sekalipun.',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80',
    'ONE SIZE', 0, 4.60, 33, 120
  );

-- ─── Product ↔ Category mappings ─────────────────────────────

INSERT INTO product_categories (product_id, category_id) VALUES
  (1,  1),  -- Essential White Tee      → T-Shirts
  (2,  2),  -- Oversized Linen Shirt    → Shirts
  (3,  3),  -- Straight Leg Trousers    → Trousers
  (4,  4),  -- Minimal Trench Coat      → Outerwear
  (5,  5),  -- Slip Dress               → Dresses
  (6,  6),  -- Ribbed Knit Sweater      → Knitwear
  (7,  3),  -- Wide Leg Pants           → Trousers
  (8,  4),  -- Fitted Blazer            → Outerwear
  (9,  1),  -- Crew Neck Tee            → T-Shirts
  (10, 2),  -- Oxford Button-Down       → Shirts
  (11, 5),  -- Wrap Midi Dress          → Dresses
  (12, 7);  -- Canvas Tote Bag          → Accessories

-- ─── Sample Orders ───────────────────────────────────────────

INSERT INTO orders (user_id, total_amount, shipping_address, customer_name, customer_phone, status) VALUES
  (2, 648000,  'Jl. Margonda Raya No. 12, Depok, Jawa Barat 16424',  'Afif Naufal',  '081234567890', 'Completed'),
  (2, 1299000, 'Jl. Margonda Raya No. 12, Depok, Jawa Barat 16424',  'Afif Naufal',  '081234567890', 'Shipped'),
  (3, 938000,  'Jl. Sudirman No. 45, Jakarta Pusat, DKI Jakarta 10220','Siti Rahayu', '087654321098', 'Completed'),
  (4, 429000,  'Jl. Pemuda No. 8, Surabaya, Jawa Timur 60271',        'Budi Santoso', '085551234567', 'Pending');

-- ─── Order Items ─────────────────────────────────────────────

INSERT INTO order_items (order_id, product_id, quantity, price, size) VALUES
  (1, 1, 2, 189000, 'M'),    -- 2x Essential White Tee
  (1, 9, 1, 169000, 'L'),    -- 1x Crew Neck Tee
  (1, 1, 1, 189000, 'L'),    -- 1x Essential White Tee → total 648000
  (2, 4, 1, 1299000, 'S'),   -- 1x Minimal Trench Coat
  (3, 6, 1, 529000, 'M'),    -- 1x Ribbed Knit Sweater
  (3, 12, 1, 249000, 'ONE SIZE'), -- 1x Canvas Tote Bag → total 938000 (discount applied)
  (4, 10, 1, 429000, 'M');   -- 1x Oxford Button-Down

-- ─── Sample Reviews ──────────────────────────────────────────

INSERT INTO reviews (product_id, user_id, rating, comment) VALUES
  (1, 2, 5, 'Kualitas cotton-nya premium banget, adem dan tidak mudah melar. Udah beli 3 warna!'),
  (1, 3, 4, 'Bagus, tapi ukurannya sedikit kecil. Sarankan ambil 1 size lebih besar.'),
  (4, 3, 5, 'Bahan raincoat-nya mantap, hujan deras pun aman. Worth every penny!'),
  (6, 2, 4, 'Sweater-nya warm dan nyaman, tapi perlu diperhatikan cara mencucinya supaya tidak melar.'),
  (12, 4, 5, 'Tasnya besar dan kuat. Sudah pakai 3 bulan, jahitannya masih rapi semua.');
