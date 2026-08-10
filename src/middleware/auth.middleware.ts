import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../types/express.js';
import { verifyToken } from '../utils/jwt.js';

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  try {
    const payload = verifyToken(token);

    req.user = {
      id: payload.userId,
    };

    next();
  } catch {
    return res.status(401).json({
      message: 'Invalid token',
    });
  }
};
