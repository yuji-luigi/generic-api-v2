import { Request, Response } from 'express';
import logger from '../../config/logger';

import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Space from '../../models/Space';

// import MSG from '../../utils/messages';
// import { runInNewContext } from 'vm';
// import { deleteEmptyFields, getEntity } from '../../utils/functions';

//================================================================================
// CUSTOM CONTROLLER...
//================================================================================
export const createHeadSpace = async (req: Request, res: Response) => {
  try {
    const newSpace = new Space({
      ...req.body,
      isHead: true,
    });
    await newSpace.save();
    res.status(httpStatus.CREATED).json({
      success: true,
      collection: 'spaces',
      data: newSpace,
      count: 1
    });
  } catch (err) {
    logger.error(err.message || err);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: err.message || err });
  }
};
export const getLinkedChildren = async (req: Request, res: Response) => {
  try {
    const {parentId, entity} = req.params;
    const children = await mongoose.model(entity).find({parentId});
    res.status(httpStatus.CREATED).json({
      success: true,
      collection: 'spaces',
      data: children,
      count: 1
    });
  } catch (err) {
    logger.error(err.message || err);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: err.message || err });
  }
};
