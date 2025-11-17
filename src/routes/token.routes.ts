import { Router } from 'express';
import * as tokenController from '../controllers/token.controller';
import { validate, validateQuery } from '../middlewares/validation.middleware';
import {
  issueTokenSchema,
  checkTokenSchema,
  mintRewardTokenSchema,
  delegateTokenSchema,
} from '../validators/token.validator';
import { asyncHandler } from '../middlewares/async.middleware';

const router = Router();

router.post('/issueToken', validate(issueTokenSchema), asyncHandler(tokenController.issueToken));

router.get(
  '/checkToken',
  validateQuery(checkTokenSchema),
  asyncHandler(tokenController.checkToken)
);

router.post(
  '/mintRewardToken',
  validate(mintRewardTokenSchema),
  asyncHandler(tokenController.mintRewardToken)
);

router.post(
  '/delegateToken',
  validate(delegateTokenSchema),
  asyncHandler(tokenController.delegateToken)
);

export default router;
