// /server/index.js (Versi Final untuk Produksi)

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/categories', categoryRoutes);

// --- PERUBAHAN DI SINI ---
// HAPUS ATAU BERI KOMENTAR BAGIAN INI

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT} dan terhubung ke MySQL.`);
});

// TAMBAHKAN BARIS INI DI AKHIR
module.exports = app;
// -------------------------