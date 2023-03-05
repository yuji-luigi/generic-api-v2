import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';

interface RequestWithUser extends Request {
  user: IUser}

export const handleQuery = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
):void => {

  if(req.user.role === 'super_admin') {
    return next();
  }

  if(req.user.role !== 'super_admin') {
    req.query = {
      ...req.query,
      owner: req.user.owner.toString()
    };
    return next();
  }
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Something went wrong'
  });
  return null;
};