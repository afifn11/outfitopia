// src/routes/admin.routes.ts
import { Router } from 'express';
import { protect, requireAdmin } from '../middleware/auth.middleware.js';
import * as adminController from '../controllers/admin.controller.js';
import * as orderController from '../controllers/order.controller.js';

const router = Router();

// Semua admin route butuh auth + role admin
router.use(protect, requireAdmin);

// Dashboard
router.get('/stats', adminController.getDashboardStats);

// Product management
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// Order management
router.get('/orders', adminController.getAllOrders);
router.patch('/orders/:id/status', orderController.updateOrderStatus);

// Review management
router.get('/reviews', adminController.getAllReviews);
router.delete('/reviews/:id', adminController.deleteReview);

// User management
router.get('/users', adminController.getAllUsers);

export default router;
