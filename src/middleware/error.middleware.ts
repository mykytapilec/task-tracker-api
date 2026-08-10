import type { ErrorRequestHandler } from 'express';

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, next) => {
  if (!err) {
    next();
    return;
  }

  res.status(500).json({
    message: err.message ?? 'Internal server error',
  });
};
