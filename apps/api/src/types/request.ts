import { RequestHandler } from 'express';

export type HandleRequest<
  Body = any,
  Param = any,
  QueryParam = any,
> = RequestHandler<Param, any, Body, QueryParam>;
