// /server/routes/adminRoutes.js (Versi Final dengan Rute Ulasan)

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');
const { 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    getAllOrders, 
    updateOrderStatus,
    getAllReviews,      // <- Perubahan di sini
    deleteReview        // <- Perubahan di sini
} = require('../controllers/adminController');

// Semua rute di file ini akan diproteksi oleh 'protect' dan 'isAdmin'
router.use(protect, isAdmin);

// Rute Produk
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Rute Order
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// ===================================
// === RUTE BARU DITAMBAHKAN DI SINI ===
// ===================================
// Rute Ulasan
router.get('/reviews', getAllReviews);
router.delete('/reviews/:id', deleteReview);

module.exports = router;