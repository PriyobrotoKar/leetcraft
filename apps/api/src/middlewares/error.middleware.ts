import { ErrorRequestHandler } from 'express';
import env from '../config/env';
import logger from '../config/logger';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const status = 'error';

  if (env.NODE_ENV !== 'production') {
    logger.error(err);
  }

  res.status(statusCode).json({
    status,
    message,
  });
};
