/* eslint-disable no-undef */

import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import UserSchema from '../models/User';
import APIError from '../errors/api.error';
import { Promise } from 'bluebird';

import MSG from '../utils/messages';
import { RequestCustom } from '../types/custom-express/express-custom';
import passport from 'passport';

export const isLoggedIn =
  (roles: string[] | string = UserSchema.roles) =>
  async (req: RequestCustom, res: Response, next: NextFunction) => {
    if (roles.includes(req.user?.role)) {
      return next();
    }
    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: MSG().NOT_AUTHORIZED,
      user: null
    });
    throw Error('user not authorized');
  };

// const handleJWT =
//   (
//     req: RequestCustom,
//     res: Response,
//     next: NextFunction,
//     roles: string[] | string
//   ) =>
//   async (err: any, user: IUser, info: any) => {
//     const error = err || info;
//     const logIn = Promise.promisify(req.logIn);
//     const apiError = new APIError({
//       message: error ? error.message : 'Unauthorized',
//       status: httpStatus.UNAUTHORIZED,
//       stack: error ? error.stack : undefined
//     });

//     try {
//       if (error || !user) throw error;
//       await logIn(user /*,  { session: false } */);
//     } catch (e) {
//       return next(apiError);
//     }

//     if (roles === LOGGED_USER) {
//       // me route shows only the user himself no other users
//       if (user.role !== 'admin' && req.params.userId !== user._id.toString()) {
//         apiError.status = httpStatus.FORBIDDEN;
//         apiError.message = 'Forbidden';
//         return next(apiError);
//       }
//     } else if (!roles.includes(user.role)) {
//       apiError.status = httpStatus.FORBIDDEN;
//       apiError.message = MSG().NOT_AUTHORIZED;
//       return next(apiError);
//     } else if (err || !user) {
//       return next(apiError);
//     }

//     req.user = user;

//     if (req.user.role === 'super_admin') {
//       return next();
//     }

//     if (req.user.role !== 'super_admin') {
//       req.query = {
//         ...req.query,
//         organization: req.user.organization.toString()
//       };
//       return next();
//     }
//   };

// export const isLoggedIn =
//   (roles = UserSchema.roles) =>
//   (req: RequestCustom, res: Response, next: NextFunction) =>
//     passport.authenticate(
//       'jwt',
//       { session: false },
//       handleJWT(req, res, next, roles)
//     )(req, res, next);

export const getUser =
  () => (req: RequestCustom, res: Response, next: NextFunction) =>
    passport.authenticate('jwt', { session: false }, setUser(req, res, next))(
      req,
      res,
      next
    );

const setUser =
  (req: RequestCustom, res: Response, next: NextFunction) =>
  async (err: any, user: IUser & boolean, info: any) => {
    // define case for login route the user is false. call next to login the user
    if (user === false) {
      return next();
    }
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

    req.user = user;

    if (req.user.role === 'super_admin') {
      return next();
    }

    if (req.user.role !== 'super_admin') {
      req.query = {
        ...req.query,
        organization: req.user.organization?._id
      };
      return next();
    }
  };

//  IF THE PROJECT HAS MODULE FUNCTIONALITY YOU CAN USE THIS
export const checkModules = (
  req: RequestCustom,
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
export const SUPER_ADMIN = 'super_admin';
