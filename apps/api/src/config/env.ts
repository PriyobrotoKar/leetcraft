import z from 'zod';
import { configDotenv } from 'dotenv';

configDotenv();

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  PORT: z.coerce.number().default(8000),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('1h'),
});

const env = EnvSchema.parse(process.env);

export default env;
