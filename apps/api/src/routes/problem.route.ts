import ProblemController from '@/controllers/problem.controller';
import { CreateProblemSchema, ValidateProblemSchema } from '@/dto/problem.dto';
import verifyAdmin from '@/middlewares/admin.middleware';
import validateSchema from '@/middlewares/validation.middleware';
import { Router } from 'express';
import z from 'zod';

const problemRouter: Router = Router();

const problemController = new ProblemController();

problemRouter.post(
  '/',
  verifyAdmin,
  validateSchema({ body: CreateProblemSchema }),
  problemController.createProblem,
);

problemRouter.post(
  '/:id/validate',
  verifyAdmin,
  validateSchema({
    body: ValidateProblemSchema,
    param: z.object({ id: z.string() }),
  }),
  problemController.validateProblem,
);

problemRouter.put(
  '/:id/validate/callback',
  problemController.validateProblemCallback,
);

problemRouter.get('/', problemController.getAllProblems);

problemRouter.get(
  '/created',
  verifyAdmin,
  problemController.getProblemsCreatedByUser,
);

problemRouter.get(
  '/:id',
  validateSchema({ param: z.object({ id: z.string() }) }),
  problemController.getProblemById,
);

problemRouter.patch(
  '/:id',
  verifyAdmin,
  validateSchema({
    body: CreateProblemSchema.partial(),
    param: z.object({ id: z.string() }),
  }),
  problemController.updateProblem,
);

problemRouter.delete(
  '/:id',
  verifyAdmin,
  validateSchema({ param: z.object({ id: z.string() }) }),
  problemController.deleteProblem,
);

export default problemRouter;
