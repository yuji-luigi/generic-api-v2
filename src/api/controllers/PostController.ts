import Thread from '../../models/Thread';
import httpStatus from 'http-status';
import logger from '../../config/logger';
import { Request, Response } from 'express';
import { deleteEmptyFields } from '../../utils/functions';
import {
  createFilesDirName,
  saveInStorage,
  separateFiles
} from '../helpers/uploadFileHelper';
import Upload from '../../models/Upload';
/**
 * POST CONTROLLERS
 */

interface UploadsThread {
  [key: string]: UploadInterface[];
  images: UploadInterface[];
  attachments: UploadInterface[];
}

const postController = {
  createThread: async (req: Request, res: Response) => {
    try {
      req.body.createdBy = req.user;
      const data = deleteEmptyFields<IThread>(req.body);
      const [filesToUpload] = separateFiles(req.files);
      const generalDirName = createFilesDirName(req.user, req.body.folderName);
      const uploadModelsData = await saveInStorage(
        filesToUpload,
        generalDirName
      );
      // const uploadModelIds = existingFilesId;

      const uploads: UploadsThread = { images: [], attachments: [] };
      for (const key in uploadModelsData) {
        const data = uploadModelsData[key];
        const createdModel = await Upload.create(data);
        // uploadModelIds.push(createdModel._id.toString());
        uploads[data.fieldInModel].push(createdModel);
      }

      data.images = uploads.images;
      data.attachments = uploads.attachments;
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
  },

  sendThreadToFrondEnd: async (req: Request, res: Response) => {
    try {
      const threads = await Thread.find(req.query);
      if (threads.length) {
        for (const thread of threads) {
          await thread.setStorageUrlToModel();
        }
      }
      res.status(httpStatus.CREATED).json({
        success: true,
        collection: 'posts',
        data: threads,
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
