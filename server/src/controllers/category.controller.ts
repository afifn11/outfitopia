// src/controllers/category.controller.ts
import { Request, Response, NextFunction } from 'express';
import pool from '../config/db.js';

export const getAllCategories = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [rows] = await pool.query<any[]>('SELECT * FROM categories ORDER BY name ASC');
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};
