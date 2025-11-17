import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Async error wrapper middleware
 * Catches async errors and forwards them to error handler
 */
export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
