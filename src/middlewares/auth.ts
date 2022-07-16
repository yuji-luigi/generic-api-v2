/* eslint-disable no-undef */

import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import passport from 'passport';
import UserSchema from '../models/User';
import { IUser } from 'model/user';
import APIError from '../errors/api.error';
import { Promise } from 'bluebird';

import MSG from '../utils/messages';
import { TypedRequestBody } from 'express-custom';

const handleJWT =
  (req: Request, res: Response, next: NextFunction, roles: string[] | string) =>
    async (err: any, user: IUser, info: any) => {
      const error = err || info;
      const logIn = Promise.promisify(req.logIn);
      const apiError = new APIError({
        message: error ? error.message : 'Unauthorized',
        status: httpStatus.UNAUTHORIZED,
        stack: error ? error.stack : undefined
      });

      try {
        if (error || !user) throw error;
        await logIn(user /*,  { session: false } */);
      } catch (e) {
        return next(apiError);
      }

      if (roles === LOGGED_USER) {
      // me route shows only the user himself no other users
        if (user.role !== 'admin' && req.params.userId !== user._id.toString()) {
          apiError.status = httpStatus.FORBIDDEN;
          apiError.message = 'Forbidden';
          return next(apiError);
        }
      } else if (!roles.includes(user.role)) {
        apiError.status = httpStatus.FORBIDDEN;
        apiError.message = MSG().NOT_AUTHORIZED;
        return next(apiError);
      } else if (err || !user) {
        return next(apiError);
      }

      req.user = user;
      res.locals.user = user;
      return next();
    };

// export const isLoggedIn = (roles = User.roles) => (req, res, next) => {
//     // passport.authenticate(
//     //     'jwt',
//     //     { session: false },
//     //     handleJWT(req, res, next, roles),
//     // )(req, res, next);
//     next();
// };

export const isLoggedIn =
  (roles = UserSchema.roles) =>
    (req: Request, res: Response, next: NextFunction) =>
      passport.authenticate(
        'jwt',
        { session: false },
        handleJWT(req, res, next, roles)
      )(req, res, next);

// export const isAdmin = (req, res, next) => {
//     if (req.user.role !== 'admin') {
//         return res.status(httpStatus.UNAUTHORIZED).send({ error: MSG().NOT_AUTHORIZED });
//     }
//     next();
// };

//  IF THE PROJECT HAS MODULE FUNCTIONALITY YOU CAN USE THIS
export const checkModules = (
  req: TypedRequestBody<null, IUser>,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role === 'admin') {
    return next();
  }
  const regex = /\//g;
  const entity: string = req.params.entity || req.url.replaceAll(regex, '');
  const { modules } = req.user;
  //  module[entity] = true; hai accesso api se no mando errore
  return modules[entity]
    ? next()
    : res.status(httpStatus.UNAUTHORIZED).send({ error: MSG().NOT_AUTHORIZED });
};

export const ADMIN = 'admin';
export const LOGGED_USER = 'user';
