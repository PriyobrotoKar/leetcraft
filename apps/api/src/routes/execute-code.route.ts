import ExecuteController from '@/controllers/execute-code.controller';
import { ExecuteCodeSchema, ValidateCodeSchema } from '@/dto/exceute-code.dto';
import validateSchema from '@/middlewares/validation.middleware';
import { Router } from 'express';

const executeRouter: Router = Router();

const executeController = new ExecuteController();

executeRouter.post(
  '/',
  validateSchema({ body: ExecuteCodeSchema }),
  executeController.executeCode,
);

executeRouter.post(
  '/validate',
  validateSchema({ body: ValidateCodeSchema }),
  executeController.validateCode,
);

export default executeRouter;
