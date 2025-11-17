import { Request, Response } from 'express';
import userService from '../services/user.service';
import { successResponse } from '../utils/response';
import { RegisterUserRequest } from '../types/api.types';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const request: RegisterUserRequest = req.body;
  const result = await userService.registerUser(request);
  successResponse(res, result.data, result.message, 201);
};
