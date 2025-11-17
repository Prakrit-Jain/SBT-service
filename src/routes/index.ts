import { Router } from 'express';
import userRoutes from './user.routes';
import tokenRoutes from './token.routes';

const router = Router();

router.use('/', userRoutes);
router.use('/', tokenRoutes);

export default router;
