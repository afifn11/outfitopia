// src/controllers/order.controller.ts
import { Request, Response, NextFunction } from 'express';
import { createOrderSchema, updateOrderStatusSchema } from '../utils/validators.js';
import * as orderService from '../services/order.service.js';
import type { OrderStatus } from '../types/index.js';

export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input = createOrderSchema.parse(req.body);
    const userId = req.user!.id;
    const result = await orderService.createOrder(userId, input);
    res.status(201).json({ success: true, data: result, message: 'Pesanan berhasil dibuat' });
  } catch (err) {
    next(err);
  }
};

export const getMyOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orders = await orderService.getMyOrders(req.user!.id);
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orderId = Number(req.params['id']);
    const result = await orderService.getOrderById(orderId, req.user!.id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status } = updateOrderStatusSchema.parse(req.body);
    const orderId = Number(req.params['id']);
    await orderService.updateOrderStatus(orderId, status as OrderStatus);
    res.json({ success: true, message: 'Status pesanan berhasil diperbarui' });
  } catch (err) {
    next(err);
  }
};
