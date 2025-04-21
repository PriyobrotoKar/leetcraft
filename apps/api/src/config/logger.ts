import { createLogger, format, transports } from 'winston';
import env from './env';

const { combine, errors, colorize, timestamp, printf } = format;

const logger = createLogger({
  level: env.LOG_LEVEL,
  format: combine(
    errors({ stack: true }),
    timestamp(),
    colorize({ all: true }),
    printf(
      ({ level, message, timestamp, stack }) =>
        `[${timestamp}] ${level}: ${message} ${stack ? `\n${stack}` : ''}`,
    ),
  ),
  transports: [new transports.Console()],
});

export default logger;
