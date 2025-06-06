import { Router } from 'express';
import authRouter from './auth.route';
import problemRouter from './problem.route';
import executeRouter from './execute-code.route';
import submissionRouter from './submission.route';
import playlistRouter from './playlist.route';

const router: Router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

router.use('/auth', authRouter);
router.use('/problems', problemRouter);
router.use('/execute', executeRouter);
router.use('/submissions', submissionRouter);
router.use('/playlists', playlistRouter);

export default router;
