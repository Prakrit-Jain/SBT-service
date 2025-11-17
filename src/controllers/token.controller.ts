import { Request, Response } from 'express';
import tokenService from '../services/token.service';
import { successResponse } from '../utils/response';
import {
  IssueTokenRequest,
  CheckTokenRequest,
  MintRewardTokenRequest,
  DelegateTokenRequest,
} from '../types/api.types';

export const issueToken = async (req: Request, res: Response): Promise<void> => {
  const request: IssueTokenRequest = req.body;
  const result = await tokenService.issueToken(request);
  successResponse(res, result.data, result.message, 201);
};

export const checkToken = async (req: Request, res: Response): Promise<void> => {
  const request: CheckTokenRequest = {
    walletAddress: req.query.walletAddress as string,
    blockchain: req.query.blockchain as string,
    isDelegated: req.query.isDelegated === 'true',
  };
  const result = await tokenService.checkToken(request);
  successResponse(res, result.data, result.message);
};

export const mintRewardToken = async (req: Request, res: Response): Promise<void> => {
  const request: MintRewardTokenRequest = req.body;
  const result = await tokenService.mintRewardToken(request);
  successResponse(res, result.data, result.message, 201);
};

export const delegateToken = async (req: Request, res: Response): Promise<void> => {
  const request: DelegateTokenRequest = req.body;
  const result = await tokenService.delegateToken(request);
  successResponse(res, result.data, result.message, 201);
};
