import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { validate } from '../middlewares/validation.middleware';
import { registerUserSchema } from '../validators/user.validator';
import { asyncHandler } from '../middlewares/async.middleware';

const router = Router();

router.post(
  '/registerUser',
  validate(registerUserSchema),
  asyncHandler(userController.registerUser)
);

export default router;
