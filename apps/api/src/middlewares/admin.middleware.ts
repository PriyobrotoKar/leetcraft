import { UnauthorizedError } from '@/lib/ApiError';
import { Role } from '@leetcraft/db';
import { RequestHandler } from 'express';

const verifyAdmin: RequestHandler = (req, _res, next) => {
  if (req.user.role !== Role.ADMIN) {
    throw new UnauthorizedError(
      'You are not authorized to access this resource',
    );
  }

  next();
};

export default verifyAdmin;
