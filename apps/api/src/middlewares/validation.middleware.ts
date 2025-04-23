import { RequestHandler } from 'express';
import { ZodSchema } from 'zod';

const validateSchema = (schema: ZodSchema): RequestHandler => {
  return (req, _res, next) => {
    const parsedData = schema.parse(req.body);
    req.body = parsedData;
    next();
  };
};

export default validateSchema;
