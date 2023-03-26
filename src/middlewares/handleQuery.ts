import { RequestCustom } from './../types/custom-express/express-custom.d';
import { NextFunction, Response } from 'express';

type RequestWithOrganization = RequestCustom<unknown, unknown, { organization: string }, { organization: string }>;

export const handleQuery = (req: RequestWithOrganization, res: Response, next: NextFunction): void => {
  if (req.user.role === 'super_admin') {
    return next();
  }

  req.query.organization = req.user.organization._id;
  return next();
};

const setBody = (req: RequestWithOrganization, res: Response, next: NextFunction) => {
  const { user } = req;
  if (req.user.role === 'super_admin') {
    return next();
  }

  req.body.organization = user.organization._id;
  return next();
};

export const handleOrganization =
  () =>
  (req: RequestWithOrganization, res: Response, next: NextFunction): void => {
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
