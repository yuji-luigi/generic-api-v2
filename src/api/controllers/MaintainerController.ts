import { SUPER_ADMIN } from '../../middlewares/auth';
import Maintainer from '../../models/Maintainer';
import httpStatus from 'http-status';
import logger from '../../config/logger';
import { Request, Response } from 'express';
import { deleteEmptyFields, hasDuplicatesInArray } from '../../utils/functions';
import { createFilesDirName, saveInStorage, separateFiles } from '../helpers/uploadFileHelper';
import Upload from '../../models/Upload';
import { RequestCustom } from '../../types/custom-express/express-custom';
import { authClientRun } from '../helpers/nodemailerHelper';
import { _MSG } from '../../utils/messages';
import { aggregateWithPaginationMaintainer } from '../helpers/mongoose.helper';
import Organization from '../../models/Organization';
import Space from '../../models/Space';

export const createMaintainer = async (req: RequestCustom, res: Response) => {
  try {
    const foundMaintainer = await Maintainer.findOne({ email: req.body.email });
    if (foundMaintainer) {
      throw new Error(_MSG.MAINTAINER_EXISTS);
    }

    req.body.createdBy = req.user;
    const reqBody = deleteEmptyFields<MaintainerInterface>(req.body);
    const newMaintainer = new Maintainer(reqBody);
    await newMaintainer.save();

    const organization = await Organization.findById(req.organization);
    if (organization) {
      organization.maintainers.push(newMaintainer);
      await organization.save();
    }

    const space = await Space.findById(req.space);
    if (space) {
      space.maintainers.push(newMaintainer);
      await space.save();
    }

    const data = await Maintainer.find({ _id: { $in: organization.maintainers } });

    res.status(httpStatus.CREATED).json({
      success: true,
      collection: 'maintainers',
      data,
      count: data.length
    });
  } catch (error) {
    logger.error(error.message || error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message || error,
      success: false
    });
  }
};

export const sendMaintainersWithPaginationToClient = async (req: RequestCustom, res: Response) => {
  try {
    const entity = 'maintainers';

    const queryMaintainer = req.space?.maintainers || req.organization?.maintainers;

    const maintainers = await Maintainer.find({ _id: { $in: queryMaintainer } });

    //  TODO: use req.query for querying in find method and paginating. maybe need to delete field to query in find method

    res.status(httpStatus.OK).json({
      success: true,
      collection: entity,
      data: maintainers,
      totalDocuments: maintainers.length
    });
  } catch (err) {
    res.status(err).json({
      message: err.message || err
    });
  }
};

export default {
  createMaintainer,
  sendMaintainersWithPaginationToClient
};
