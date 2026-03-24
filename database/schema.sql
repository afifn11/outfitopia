-- ============================================================
-- Outfitopia — Database Schema
-- MySQL 8.0+
-- Jalankan: mysql -u root -p outfitopia < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS outfitopia
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE outfitopia;

-- ─── Users ───────────────────────────────────────────────────

CREATE TABLE users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  password      VARCHAR(255)  NOT NULL,
  role          ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role  (role)
);

-- ─── Categories ──────────────────────────────────────────────

CREATE TABLE categories (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL UNIQUE,
  slug       VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─── Products ────────────────────────────────────────────────

CREATE TABLE products (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(255)   NOT NULL,
  price          DECIMAL(12,2)  NOT NULL,
  description    TEXT,
  image          VARCHAR(500)   NOT NULL,
  sizes          VARCHAR(100)   NOT NULL DEFAULT '',
  is_featured    TINYINT(1)     NOT NULL DEFAULT 0,
  average_rating DECIMAL(3,2)   NOT NULL DEFAULT 0.00,
  num_reviews    INT UNSIGNED   NOT NULL DEFAULT 0,
  stock          INT UNSIGNED   NOT NULL DEFAULT 0,
  created_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_featured (is_featured),
  INDEX idx_price    (price)
);

-- ─── Product ↔ Category (many-to-many) ───────────────────────

CREATE TABLE product_categories (
  product_id  INT UNSIGNED NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (product_id, category_id),
  FOREIGN KEY (product_id)  REFERENCES products(id)   ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- ─── Orders ──────────────────────────────────────────────────

CREATE TABLE orders (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id          INT UNSIGNED  NOT NULL,
  total_amount     DECIMAL(12,2) NOT NULL,
  shipping_address TEXT          NOT NULL,
  customer_name    VARCHAR(100)  NOT NULL,
  customer_phone   VARCHAR(20)   NOT NULL,
  status           ENUM('Pending','Shipped','Completed','Cancelled') NOT NULL DEFAULT 'Pending',
  order_date       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id   (user_id),
  INDEX idx_status    (status),
  INDEX idx_order_date (order_date)
);

-- ─── Order Items ─────────────────────────────────────────────

CREATE TABLE order_items (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id   INT UNSIGNED  NOT NULL,
  product_id INT UNSIGNED  NOT NULL,
  quantity   INT UNSIGNED  NOT NULL DEFAULT 1,
  price      DECIMAL(12,2) NOT NULL,
  size       VARCHAR(10)   NOT NULL DEFAULT '',
  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
  INDEX idx_order_id   (order_id),
  INDEX idx_product_id (product_id)
);

-- ─── Reviews ─────────────────────────────────────────────────

CREATE TABLE reviews (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id INT UNSIGNED NOT NULL,
  user_id    INT UNSIGNED NOT NULL,
  rating     TINYINT      NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_product (user_id, product_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  INDEX idx_product_id (product_id)
);

-- Add google_id column for OAuth (run if not exists)
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) NULL;
