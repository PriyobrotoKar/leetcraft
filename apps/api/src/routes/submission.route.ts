import SubmissionController from '@/controllers/submission.controller';
import { SubmissionSchema } from '@/dto/submission.dto';
import validateSchema from '@/middlewares/validation.middleware';
import { Router } from 'express';

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

export default submissionRouter;
