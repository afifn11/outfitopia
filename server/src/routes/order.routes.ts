// src/routes/order.routes.ts
import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect); // semua order route butuh auth

router.post('/', orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);

export default router;
