-- Tambahkan kolom untuk mendukung Google OAuth
-- Jalankan: mysql -u root outfitopia < add_google_oauth.sql
USE outfitopia;

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS google_id VARCHAR(100) NULL DEFAULT NULL AFTER email,
    ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500) NULL DEFAULT NULL AFTER google_id;

-- Buat password field nullable untuk user Google OAuth
ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NULL DEFAULT NULL;

-- Index untuk Google ID lookup
CREATE INDEX IF NOT EXISTS idx_google_id ON users (google_id);
