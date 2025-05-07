import { RequestHandler } from 'express';
import { ZodSchema } from 'zod';

const validateSchema = (schema: {
  body?: ZodSchema;
  param?: ZodSchema;
}): RequestHandler => {
  return (req, _res, next) => {
    const parsedParams = schema.param?.parse(req.params);
    req.params = parsedParams;

    const parsedBody = schema.body?.parse(req.body);
    req.body = parsedBody;

    next();
  };
};

export default validateSchema;
