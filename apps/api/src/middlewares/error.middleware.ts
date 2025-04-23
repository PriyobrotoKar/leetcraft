import { ErrorRequestHandler } from 'express';
import env from '../config/env';
import logger from '../config/logger';
import { ApiError } from '@/lib/ApiError';
import { ZodError } from 'zod';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  const status = 'error';

  if (err instanceof ZodError) {
    statusCode = 400;
    res.status(statusCode).json({
      status,
      errors: err.errors,
    });

    return;
  }

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  if (env.NODE_ENV !== 'production') {
    logger.error(err);
  }

  res.status(statusCode).json({
    status,
    message,
  });
};
