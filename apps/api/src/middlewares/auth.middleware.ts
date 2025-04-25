import { UnauthorizedError } from '@/lib/ApiError';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { RequestHandler } from 'express';
import env from '@/config/env';
import { CurrentUser } from '@/types/auth';
import { API_PREFIX } from '@/lib/constants';

const publicRoutes = [
  `${API_PREFIX}/auth/login`,
  `${API_PREFIX}/auth/register`,
  `${API_PREFIX}/health`,
];

const verifyToken: RequestHandler = (req, _res, next) => {
  // Check if the request is to a public route
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  // Check if the request has a token in the cookies or the authorization header
  const token = req.cookies.token ?? req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new UnauthorizedError();
  }

  try {
    // Verify the token
    const payload = jwt.verify(token, env.JWT_SECRET);

    // Attach the user to the request object
    req.user = payload as CurrentUser;

    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new UnauthorizedError();
    }
    throw error;
  }
};

export default verifyToken;
