// src/routes/review.routes.ts
import { Router } from 'express';
import * as reviewController from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/:id', reviewController.getProductReviews);
router.post('/:id', protect, reviewController.createProductReview);

export default router;
