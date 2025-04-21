import express, { Application, Request } from 'express';
import { ApiError, NotFoundError } from '@/lib/ApiError';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import limiter from '@/middlewares/rate-limiter.middleware';
import { errorHandler } from '@/middlewares/error.middleware';
import { requestLogger } from '@/middlewares/request.middleware';
import router from '@/routes';

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors());

// Rate Limiting Middleware
app.use(limiter);

// Log all incoming requests
app.use(requestLogger);

// API routes
app.use('/api/v1', router);

// 404 handler for undefined routes
app.use((req: Request) => {
  throw new NotFoundError(
    `Resource not found: ${req.method} ${req.originalUrl}`,
  );
});

// Global error handler
app.use(errorHandler);

export default app;
