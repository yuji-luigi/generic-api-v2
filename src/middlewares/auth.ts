/* eslint-disable no-undef */

import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import APIError from '../errors/api.error';
import { Promise } from 'bluebird';

import MSG from '../utils/messages';
import { RequestCustom } from '../types/custom-express/express-custom';
import passport from 'passport';
import { USER_ROLES } from '../types/enum/enum';
import { getEntity, getEntityFromOriginalUrl } from '../utils/functions';

export const isLoggedIn =
  (roles: USER_ROLES[] = USER_ROLES) =>
  async (req: RequestCustom, res: Response, next: NextFunction) => {
    if (roles.includes(req.user?.role)) {
      return next();
    }
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: MSG().NOT_AUTHORIZED,
      user: null
    });
    // throw Error('user not authorized');
  };

export const handleUserFromRequest = () => (req: RequestCustom, res: Response, next: NextFunction) =>
  passport.authenticate('jwt', { session: false }, setUserInRequest(req, res, next))(req, res, next);

// if user is present frm jwt token then set it to req.user
// if not just pass without setting req.user
const setUserInRequest = (req: RequestCustom, res: Response, next: NextFunction) => async (err: any, user: IUser & boolean, info: any) => {
  // define case for login route the user is false. call next to login the user
  if (user === false) {
    return next();
  }
  const error = err || info;
  // const logIn = Promise.promisify(req.logIn);
  const apiError = new APIError({
    message: error ? error.message : 'Unauthorized',
    status: httpStatus.UNAUTHORIZED,
    stack: error ? error.stack : undefined
  });

  // try {
  //   if (error) throw error;
  //   await logIn(user /*,  { session: false } */);
  // } catch (e) {
  //   return next(apiError);
  // }
  if (error) {
    throw error;
  }
  if (!user) {
    throw new Error('user not found');
  }

  req.user = user;

  return next();
};

const setSpace = (req: RequestCustom, res: Response, next: NextFunction) => async (err: any, space: ISpace & boolean, info: any) => {
  req.space = space;

  if (req.user?.role !== 'super_admin' && space) {
    req.query = {
      ...req.query,
      organization: space?.organization.toString()
    };
    req.body.rootSpace = space?._id.toString();
  }

  const url = req.url;
  // const entity = getEntityFromOriginalUrl(url);
  // if (
  //   req.user?.role === 'super_admin' &&
  //   (entity === 'organizations' ||
  //     entity === 'users' ||
  //     entity === 'userSettings' ||
  //     entity === 'wallets' ||
  //     entity === 'uplaods' ||
  //     entity === 'spaces' ||
  //     entity === 'linkedChildren')
  // ) {
  //   delete req.query.organization;
  //   delete req.query.rootSpace;
  // }

  return next();
};

export const handleQuery = () => (req: RequestCustom, res: Response, next: NextFunction) =>
  passport.authenticate('handleSpaceJwt', { session: false }, setSpace(req, res, next))(req, res, next);

//  IF THE PROJECT HAS MODULE FUNCTIONALITY YOU CAN USE THIS
export const checkModules = (req: RequestCustom, res: Response, next: NextFunction) => {
  if (req.user.role === 'admin') {
    return next();
  }

  const regex = /\//g;
  const entity: string = req.params.entity || req.url.replaceAll(regex, '');

  const { modules } = req.user;
  //  module[entity] = true; hai accesso api se no mando errore
  return modules[entity] ? next() : res.status(httpStatus.UNAUTHORIZED).send({ error: MSG().NOT_AUTHORIZED });
};

export function clearQueriesForSAdmin(req: RequestCustom, res: Response, next: NextFunction) {
  if (req.user.role === 'super_admin') {
    delete req.query.organization;
    delete req.query.space;
  }
  next();
}

export const ADMIN = 'admin';
export const LOGGED_USER = 'user';
export const SUPER_ADMIN = 'super_admin';
