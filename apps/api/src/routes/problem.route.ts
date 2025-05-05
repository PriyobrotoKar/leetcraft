import ProblemController from '@/controllers/problem.controller';
import { CreateProblemSchema } from '@/dto/problem.dto';
import verifyAdmin from '@/middlewares/admin.middleware';
import validateSchema from '@/middlewares/validation.middleware';
import { Router } from 'express';

const problemRouter: Router = Router();

const problemController = new ProblemController();

problemRouter.post(
  '/',
  verifyAdmin,
  validateSchema(CreateProblemSchema),
  problemController.createProblem,
);

problemRouter.get('/', problemController.getAllProblems);

problemRouter.get(
  '/created',
  verifyAdmin,
  problemController.getProblemsCreatedByUser,
);

export default problemRouter;
