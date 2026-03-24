// server/routes/adminRoutes.js
require('dotenv').config();
const express = require('express');
const router  = express.Router();
const { protect }  = require('../middleware/authMiddleware');
const { isAdmin }  = require('../middleware/adminMiddleware');
const {
    createProduct, updateProduct, deleteProduct,
    getAllOrders, updateOrderStatus,
    getAllReviews, deleteReview,
    getDashboardStats, getAllUsers,
} = require('../controllers/adminController');

router.use(protect, isAdmin);

// Products
router.post('/products',         createProduct);
router.put('/products/:id',      updateProduct);
router.delete('/products/:id',   deleteProduct);

// Orders
router.get('/orders',            getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Reviews
router.get('/reviews',           getAllReviews);
router.delete('/reviews/:id',    deleteReview);

// Dashboard & Users
router.get('/stats',             getDashboardStats);
router.get('/users',             getAllUsers);

module.exports = router;
