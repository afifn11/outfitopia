// src/controllers/admin.controller.ts
import { Request, Response, NextFunction } from 'express';
import { createProductSchema, updateProductSchema } from '../utils/validators.js';
import * as adminService from '../services/admin.service.js';

export const getDashboardStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (err) { next(err); }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input = createProductSchema.parse(req.body);
    const result = await adminService.createProduct(input);
    res.status(201).json({ success: true, data: result, message: 'Produk berhasil ditambahkan' });
  } catch (err) { next(err); }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input = updateProductSchema.parse(req.body);
    const id = Number(req.params['id']);
    await adminService.updateProduct(id, input);
    res.json({ success: true, message: 'Produk berhasil diperbarui' });
  } catch (err) { next(err); }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await adminService.deleteProduct(Number(req.params['id']));
    res.json({ success: true, message: 'Produk berhasil dihapus' });
  } catch (err) { next(err); }
};

export const getAllOrders = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orders = await adminService.getAllOrders();
    res.json({ success: true, data: orders });
  } catch (err) { next(err); }
};

export const getAllReviews = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reviews = await adminService.getAllReviews();
    res.json({ success: true, data: reviews });
  } catch (err) { next(err); }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await adminService.deleteReview(Number(req.params['id']));
    res.json({ success: true, message: 'Ulasan berhasil dihapus' });
  } catch (err) { next(err); }
};

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await adminService.getAllUsers();
    res.json({ success: true, data: users });
  } catch (err) { next(err); }
};
