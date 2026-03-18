// src/routes/product.routes.ts
import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';

const router = Router();

router.get('/', productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/bestselling', productController.getBestsellingProducts);
router.get('/:id', productController.getProductById);

export default router;
