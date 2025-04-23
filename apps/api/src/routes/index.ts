import { Router } from 'express';
import authRouter from './auth.route';

const router: Router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

router.use('/auth', authRouter);

export default router;
