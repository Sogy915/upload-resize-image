import { Request, Response, NextFunction } from 'express';

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl} was requested`);
  next();
}

export function logger(message: string): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [LOG]: ${message}`);
}
