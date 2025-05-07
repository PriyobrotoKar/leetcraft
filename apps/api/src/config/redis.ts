import ioredis, { RedisOptions } from 'ioredis';
import logger from './logger';

const redisConfig: RedisOptions = {
  port: Number(process.env.REDIS_PORT) || 6378,
  host: process.env.REDIS_HOST || 'localhost',
  maxRetriesPerRequest: 3,
};

const redisConnection = new ioredis(redisConfig);

redisConnection.on('connect', () => {
  logger.info('Redis connected successfully');
});

redisConnection.on('error', (err) => {
  logger.error('Redis connection error:', err);
});

export default redisConnection;
