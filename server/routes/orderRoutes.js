// server/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { createOrder, handleNotification, getMyOrders, getOrderById } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Webhook Midtrans — TANPA protect (dipanggil oleh server Midtrans, bukan user)
router.post('/notification', handleNotification);

// Route yang butuh login
router.post('/',            protect, createOrder);
router.get('/my-orders',    protect, getMyOrders);
router.get('/:id',          protect, getOrderById);

module.exports = router;
