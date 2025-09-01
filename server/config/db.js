// /server/config/db.js (Versi Final untuk Produksi)

require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    // --- PERUBAHAN DI SINI ---
    // Menggunakan nama variabel dari Railway/Vercel
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
    // -------------------------
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Opsi tambahan untuk koneksi yang lebih stabil di layanan cloud
    connectTimeout: 20000,
    timezone: "+07:00",
});

module.exports = pool;