import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { getEntity } from '../utils/functions';
import logger from '../config/logger';

export const entities: Array<Entities> = [
  'bookmarks',
  'buildings',
  'comments',
  'floors',
  'funds',
  'fundRules',
  'instances',
  'proposals',
  'tags',
  'threads',
  'users',
  'userSettings',
  'wallets',
  'owners',
  'notifications',
  'areas',
  'spaces'
];

export const checkEntity = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const entity = req.params.entity || getEntity(req.url);
  req.params.entity = entity;
  if (entities.includes(entity as Entities)) {
    return next();
  }
  logger.error(`invalid entity access, entity: ${entity}`);
  res
    .status(httpStatus.UNAUTHORIZED)
    .json({ message: 'UNAUTHORIZED ACCESS DETECTED' });
};
