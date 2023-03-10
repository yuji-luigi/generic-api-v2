import Thread from '../../models/Thread';
import httpStatus from 'http-status';
import logger from '../../config/logger';
import { Request, Response } from 'express';
import { deleteEmptyFields } from '../../utils/functions';
/**
 * POST CONTROLLERS
 */

const postController = {
  createThread: async (req: Request, res: Response) => {
    try {
      req.body.createdBy = req.user;
      const data = deleteEmptyFields(req.body);
      const newThread = await Thread.create(data);
      res.status(httpStatus.CREATED).json({
        success: true,
        collection: 'posts',
        data: newThread,
        count: 1
      });
    } catch (error) {
      logger.error(error.message || error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message || error,
        success: false
      });
    }
  }
};

export const { createThread } = postController;
export default postController;
