import ioredis, { RedisOptions } from 'ioredis';
import logger from './logger';

const port = process.env.REDIS_PORT ?? 6378;
const host = process.env.REDIS_HOST ?? 'localhost';

const redisConfig: RedisOptions = {
  port: Number(port),
  host,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  ...(!!process.env.REDIS_HOST && { tls: {} }),
  maxRetriesPerRequest: null,
};

const redisConnection = new ioredis(redisConfig);

redisConnection.on('connect', () => {
  logger.info('Redis connected successfully');
});

redisConnection.on('error', (err) => {
  logger.error('Redis connection error:', err);
});

export default redisConnection;
