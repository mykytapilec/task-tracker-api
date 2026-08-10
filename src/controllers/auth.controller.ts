import type { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { generateToken } from '../utils/jwt.js';

export const register = async (req: Request, res: Response) => {
  const user = await authService.register(req.body);

  res.status(201).json(user);
};

export const login = async (req: Request, res: Response) => {
  const user = await authService.login(req.body);

  const token = generateToken(user.id);

  res.json({
    user,
    token,
  });
};
