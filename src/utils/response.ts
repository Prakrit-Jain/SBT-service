import { Response } from 'express';
import { ApiResponse, PaginatedResponse, ErrorResponse } from '../types/api.types';

export const successResponse = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    timestamp: new Date(),
  };

  return res.status(statusCode).json(response);
};

export const errorResponse = (
  res: Response,
  error: string,
  message = 'Error occurred',
  statusCode = 500
): Response => {
  const response: ErrorResponse = {
    success: false,
    error,
    message,
    timestamp: new Date(),
  };

  return res.status(statusCode).json(response);
};

export const paginatedResponse = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message = 'Success',
  statusCode = 200
): Response => {
  const response: PaginatedResponse<T> = {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
    message,
    timestamp: new Date(),
  };

  return res.status(statusCode).json(response);
};
