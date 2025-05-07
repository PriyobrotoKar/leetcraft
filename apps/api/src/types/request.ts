import { RequestHandler } from 'express';

export type HandleRequest<Body = any, Param = any> = RequestHandler<
  Param,
  any,
  Body
>;
