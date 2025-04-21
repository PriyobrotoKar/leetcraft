import rateLimit from 'express-rate-limit';

// Limits the number of requests to 100 per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    statusCode: 429,
    message: 'Too many requests, please try again later.',
  },
});

export default limiter;
