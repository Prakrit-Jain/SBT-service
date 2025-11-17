import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error';
import { errorResponse } from '../utils/response';
import logger from '../utils/logger';
import { config } from '../config/env';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let error = err.message;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    error = err.message;
  }

  logger.error('Error:', {
    statusCode,
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  if (config.env === 'production') {
    delete err.stack;
  }

  errorResponse(res, error, message, statusCode);
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new ApiError(404, `Route ${req.originalUrl} not found`);
  next(error);
};
