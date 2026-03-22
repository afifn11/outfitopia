-- ============================================================
-- Jalankan ini di MySQL untuk menambah kolom payment_method
-- mysql -u root outfitopia < add_payment_method.sql
-- ============================================================
USE outfitopia;

ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) NULL DEFAULT NULL AFTER status;
