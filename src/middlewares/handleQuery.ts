import { RequestCustom } from './../types/custom-express/express-custom.d';
import httpStatus from 'http-status';
import { NextFunction, Response } from 'express';

type RequestWithOwner = RequestCustom<
  unknown,
  unknown,
  { owner: IOwner },
  { owner: IOwner }
>;

export const handleQuery = (
  req: RequestWithOwner,
  res: Response,
  next: NextFunction
): void => {
  if (req.user.role === 'super_admin') {
    return next();
  }

  if (req.user.role !== 'super_admin') {
    req.query.owner = req.user.owner;
    return next();
  }

  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Something went wrong'
  }) as never;
};

const setBody = (req: RequestWithOwner, res: Response, next: NextFunction) => {
  const { user } = req;
  if (req.user.role === 'super_admin') {
    return next();
  }

  req.body.owner = user.owner;
  return next();
};

export const handleOwner =
  () =>
  (req: RequestWithOwner, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next();
    }
    if (req.method === 'POST') {
      return setBody(req, res, next);
    }
    if (req.method === 'GET') {
      return handleQuery(req, res, next);
    }
    return next();
  };
