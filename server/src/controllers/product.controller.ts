// src/controllers/product.controller.ts
import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../middleware/errorHandler.js';
import * as productService from '../services/product.service.js';

export const getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await productService.getAllProducts({
      search: req.query['search'] as string | undefined,
      sortBy: req.query['sortBy'] as string | undefined,
      order: req.query['order'] as string | undefined,
      category: req.query['category'] as string | undefined,
      page: req.query['page'] ? Number(req.query['page']) : undefined,
      limit: req.query['limit'] ? Number(req.query['limit']) : undefined,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params['id']);
    const product = await productService.getProductById(id).catch(() => null);
    if (!product) throw new NotFoundError('Produk');
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const getFeaturedProducts = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const products = await productService.getFeaturedProducts();
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

export const getBestsellingProducts = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const products = await productService.getBestsellingProducts();
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};
