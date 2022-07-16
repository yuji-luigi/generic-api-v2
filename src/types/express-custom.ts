import { Request } from 'express';

export interface TypedRequestBody<T, U> extends Request {
  body: T;
  user: U;
}
