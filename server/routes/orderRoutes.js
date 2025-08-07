// /server/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Rute ini akan diproteksi, hanya user login yang bisa akses
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);

module.exports = router;