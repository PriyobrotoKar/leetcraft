import AuthController from '@/controllers/auth.controller';
import { LoginSchema, RegisterSchema } from '@/dto/auth.dto';
import validateSchema from '@/middlewares/validation.middleware';
import { Router } from 'express';

const authRouter: Router = Router();

const authController = new AuthController();

authRouter.post(
  '/register',
  validateSchema(RegisterSchema),
  authController.register,
);
authRouter.post('/login', validateSchema(LoginSchema), authController.login);
authRouter.post('/logout', authController.logout);
authRouter.get('/me', authController.me);

export default authRouter;
