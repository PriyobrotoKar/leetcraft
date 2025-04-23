import AuthService from '@/services/auth.service';
import { Request, Response } from 'express';

class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response) => {
    const user = await this.authService.register(req.body);
    res.status(201).json(user);
  };

  login = async (req: Request, res: Response) => {
    const { token, user } = await this.authService.login(req.body);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({ token, user });
  };

  logout = (_req: Request, res: Response) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({ message: 'User logged out successfully' });
  };

  me = async (req: Request, res: Response) => {
    const user = await this.authService.me(req.user.id);
    res.status(200).json(user);
  };
}

export default AuthController;
