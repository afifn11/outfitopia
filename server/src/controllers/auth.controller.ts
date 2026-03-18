// src/controllers/auth.controller.ts
// REFACTOR: Controller tipis — hanya terima request, panggil service, kirim response

import { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema } from '../utils/validators.js';
import * as authService from '../services/auth.service.js';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input = registerSchema.parse(req.body);
    const { user, token, cookieOptions } = await authService.registerUser(input);

    // Set HttpOnly cookie — lebih aman dari localStorage
    res.cookie('token', token, cookieOptions);

    res.status(201).json({
      success: true,
      data: { user, token }, // kirim token juga untuk client yang tidak support cookie
      message: 'Registrasi berhasil',
    });
  } catch (err) {
    next(err); // delegasi ke global error handler
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input = loginSchema.parse(req.body);
    const { user, token, cookieOptions } = await authService.loginUser(input);

    res.cookie('token', token, cookieOptions);

    res.json({
      success: true,
      data: { user, token },
      message: 'Login berhasil',
    });
  } catch (err) {
    next(err);
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logout berhasil' });
};

// Endpoint untuk get current user — dipanggil client saat load app
export const getMe = (req: Request, res: Response): void => {
  res.json({ success: true, data: req.user });
};
