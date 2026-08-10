import type { NextFunction, Request, Response } from 'express';

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  console.error(error);

  res.status(400).json({
    message: error.message || 'Something went wrong',
  });
};
