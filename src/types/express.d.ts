import type { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
      };
    }
  }
}

export {};
