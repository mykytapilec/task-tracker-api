import type { NextFunction, Request, Response } from 'express';

export function errorMiddleware(
  error: Error,
  _request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  console.error(error);

  response.status(400).json({
    message: error.message || 'Internal server error',
  });
}
