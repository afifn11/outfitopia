// /server/index.js (Versi Renovasi)
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- API ROUTES ---
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);

// Endpoint checkout sementara, bisa dipindahkan ke orderRoutes nanti
app.post('/api/checkout', (req, res) => {
    const { userDetails, cartItems } = req.body;
    console.log('--- PESANAN DITERIMA (akan disimpan ke DB) ---');
    console.log('Detail Pelanggan:', userDetails);
    console.log('Item yang Dipesan:', cartItems);
    res.status(200).json({ message: 'Pesanan berhasil diterima!' });
});


// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT} dan terhubung ke MySQL.`);
});