-- ============================================================
-- Outfitopia — Reset & Re-seed
-- Gunakan saat development untuk mulai dari awal
-- JANGAN jalankan di production!
-- ============================================================

USE outfitopia;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE reviews;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE product_categories;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Setelah ini, jalankan seed.sql kembali
-- SOURCE seed.sql;
