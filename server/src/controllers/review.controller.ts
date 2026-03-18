// src/controllers/review.controller.ts
import { Request, Response, NextFunction } from 'express';
import { createReviewSchema } from '../utils/validators.js';
import * as reviewService from '../services/review.service.js';

export const getProductReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const productId = Number(req.params['id']);
    const reviews = await reviewService.getProductReviews(productId);
    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
};

export const createProductReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input = createReviewSchema.parse(req.body);
    const productId = Number(req.params['id']);
    const userId = req.user!.id;
    await reviewService.createProductReview(productId, userId, input);
    res.status(201).json({ success: true, message: 'Ulasan berhasil ditambahkan' });
  } catch (err) {
    next(err);
  }
};
