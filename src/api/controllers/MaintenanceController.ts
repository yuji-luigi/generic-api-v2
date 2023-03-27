import { SUPER_ADMIN } from '../../middlewares/auth';
import Maintenance from '../../models/Maintenance';
import httpStatus from 'http-status';
import logger from '../../config/logger';
import { Request, Response } from 'express';
import { deleteEmptyFields } from '../../utils/functions';
import { createFilesDirName, saveInStorage, separateFiles } from '../helpers/uploadFileHelper';
import Upload from '../../models/Upload';
import { RequestCustom } from '../../types/custom-express/express-custom';
import { getThreadsForPlatForm } from '../helpers/mongoose.helper';
/**
 * POST CONTROLLERS
 */

interface UploadFields {
  [key: string]: IUpload[];
  images: IUpload[];
  attachments: IUpload[];
}

const createMaintenance = async (req: RequestCustom, res: Response) => {
  try {
    req.body.createdBy = req.user;
    const reqBody = deleteEmptyFields<IMaintenance>(req.body);
    if (req.files) {
      const [filesToUpload] = separateFiles(req.files);
      const generalDirName = createFilesDirName(req.user, req.body.folderName);
      const uploadModelsData = await saveInStorage(filesToUpload, generalDirName);
      const uploads: UploadFields = { images: [], attachments: [] };

      for (const key in uploadModelsData) {
        const data = uploadModelsData[key];
        const createdModel = await Upload.create(data);
        // uploadModelIds.push(createdModel._id.toString());
        uploads[data.fieldInModel].push(createdModel);
      }
      reqBody.images = uploads.images;
      reqBody.attachments = uploads.attachments;
    }
    // const uploadModelIds = existingFilesId;
    reqBody.organization = req.user.organization;
    await Maintenance.create(reqBody);
    const threadsToSend = await getThreadsForPlatForm({ entity: 'maintenances', query: req.query });
    res.status(httpStatus.CREATED).json({
      success: true,
      collection: 'maintenances',
      data: threadsToSend,
      count: 1
    });
  } catch (error) {
    logger.error(error.message || error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message || error,
      success: false
    });
  }
};
const updateThread = async (req: RequestCustom, res: Response) => {
  try {
    req.body.createdBy = req.user;
    const reqBody = deleteEmptyFields<IMaintenance>(req.body);
    if (req.files) {
      const [filesToUpload] = separateFiles(req.files);
      const generalDirName = createFilesDirName(req.user, req.body.folderName);
      const uploadModelsData = await saveInStorage(filesToUpload, generalDirName);
      const uploads: UploadFields = { images: [], attachments: [] };

      for (const key in uploadModelsData) {
        const data = uploadModelsData[key];
        const createdModel = await Upload.create(data);
        // uploadModelIds.push(createdModel._id.toString());
        uploads[data.fieldInModel].push(createdModel);
      }
      reqBody.images = uploads.images;
      reqBody.attachments = uploads.attachments;
    }
    // const uploadModelIds = existingFilesId;
    const newThread = await Maintenance.create(reqBody);
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
};

const sendThreadToFrondEnd = async (req: Request, res: Response) => {
  try {
    const threads = await Maintenance.find(req.query).sort({
      isImportant: -1,
      createdAt: -1
    });
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
};
const sendSingleThreadToFrondEnd = async (req: Request, res: Response) => {
  try {
    const thread = await Maintenance.findById(req.params.threadId);
    if (thread) {
      await thread.setStorageUrlToModel();
    }
    res.status(httpStatus.CREATED).json({
      success: true,
      collection: 'thread',
      data: thread,
      count: 1
    });
  } catch (error) {
    logger.error(error.message || error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message || error,
      success: false
    });
  }
};
const deleteThread = async (req: RequestCustom, res: Response) => {
  try {
    const thread = await Maintenance.findById(req.params.threadId);
    // user check
    if (req.user.role === SUPER_ADMIN || req.user._id?.toString() === thread?.createdBy._id.toString() || thread.space) {
      await thread?.handleDeleteUploads();
      await Maintenance.findByIdAndDelete(req.params.threadId);
    }

    const threads = await Maintenance.find(req.query).sort({
      isImportant: -1,
      createdAt: -1
    });
    if (threads.length) {
      for (const thread of threads) {
        await thread.setStorageUrlToModel();
      }
    }

    res.status(httpStatus.CREATED).json({
      success: true,
      collection: 'threads',
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
};

// export const { createMaintenance } = postController;
const postController = {
  createMaintenance,
  updateThread,
  sendThreadToFrondEnd,
  sendSingleThreadToFrondEnd,
  deleteThread
};
export default postController;
