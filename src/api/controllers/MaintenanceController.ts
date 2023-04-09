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
    req.body.user = req.user;
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
        uploads[data.fieldInParent].push(createdModel);
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
const updateMaintenance = async (req: RequestCustom, res: Response) => {
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
        uploads[data.fieldInParent].push(createdModel);
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

const sendMaintenancesToFrondEnd = async (req: Request, res: Response) => {
  try {
    const maintenances = await Maintenance.find(req.query).sort({
      isImportant: -1,
      createdAt: -1
    });
    if (maintenances.length) {
      for (const thread of maintenances) {
        await thread.setStorageUrlToModel();
      }
    }
    res.status(httpStatus.CREATED).json({
      success: true,
      collection: 'posts',
      data: maintenances,
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
const sendSingleMaintenanceToFrondEnd = async (req: Request, res: Response) => {
  try {
    const maintenance = await Maintenance.findById(req.params.maintenanceId);
    if (maintenance) {
      await maintenance.setStorageUrlToModel();
    }
    res.status(httpStatus.CREATED).json({
      success: true,
      collection: 'maintenances',
      data: maintenance,
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
    if (req.user.role === SUPER_ADMIN || req.user._id?.toString() === thread?.user._id.toString() || thread.space) {
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
  updateMaintenance,
  sendMaintenancesToFrondEnd,
  sendSingleMaintenanceToFrondEnd,
  deleteThread
};
export default postController;
