# Outfitopia

E-commerce fashion platform — Node.js + Express backend, React + Vite frontend, MySQL database.

## Setup

### 1. Database

Buka MySQL via XAMPP atau terminal:

```bash
C:\xampp\mysql\bin\mysql -u root -p
```

Lalu jalankan:

```sql
CREATE DATABASE outfitopia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE outfitopia;
SOURCE C:/path/to/outfitopia/database/schema.sql;
SOURCE C:/path/to/outfitopia/database/seed.sql;
```

### 2. Server

```bash
cd server
npm install
cp .env.example .env    # isi DB_PASSWORD dan JWT_SECRET
npm start
```

Server berjalan di: http://localhost:5000

### 3. Client

```bash
cd client
npm install
npm run dev
```

Client berjalan di: http://localhost:5173

## Demo accounts

| Role  | Email                    | Password    |
|-------|--------------------------|-------------|
| Admin | admin@outfitopia.com     | password123 |
| User  | afif@outfitopia.com      | password123 |

## Struktur project

```
outfitopia/
├── database/         ← SQL files (schema, seed, reset)
├── server/           ← Express API
└── client/           ← React + Vite frontend
```
