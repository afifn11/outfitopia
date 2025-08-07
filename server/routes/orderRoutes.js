// /server/routes/orderRoutes.js (Versi Final)

const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById } = require('../controllers/orderController'); // <-- Import getOrderById
const { protect } = require('../middleware/authMiddleware');

// Rute ini akan diproteksi, hanya user login yang bisa akses
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById); // <-- TAMBAHKAN RUTE BARU INI

module.exports = router;