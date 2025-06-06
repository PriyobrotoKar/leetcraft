import SubmissionController from '@/controllers/submission.controller';
import { SubmissionSchema } from '@/dto/submission.dto';
import validateSchema from '@/middlewares/validation.middleware';
import { Router } from 'express';
import z from 'zod';

const submissionRouter: Router = Router();

const submissionController = new SubmissionController();

submissionRouter.post(
  '/',
  validateSchema({
    body: SubmissionSchema,
  }),
  submissionController.createSubmission,
);

submissionRouter.put('/:id/callback', submissionController.submissionCallback);

submissionRouter.get('/', submissionController.getAllSubmissions);

submissionRouter.get('/streak', submissionController.getStreak);

submissionRouter.get(
  '/:id',
  validateSchema({
    param: z.object({ id: z.string().nonempty() }),
  }),
  submissionController.getSubmissionById,
);

export default submissionRouter;
