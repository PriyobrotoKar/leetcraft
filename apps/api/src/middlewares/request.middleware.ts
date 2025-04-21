import { RequestHandler } from 'express';
import logger from '../config/logger';

export const requestLogger: RequestHandler = (req, res, next) => {
  const { method, url } = req;
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode < 400 ? 'info' : 'error';

    logger.log(level, `${method} ${url} - ${res.statusCode} - ${duration}ms`);
  });

  next();
};
