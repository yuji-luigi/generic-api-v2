import httpStatus from 'http-status';
import { Response } from 'express';
import logger from '../../config/logger';
import Space from '../../models/Space';
import Organization from '../../models/Organization';
import { RequestCustom } from '../../types/custom-express/express-custom';
import { aggregateWithPagination } from '../helpers/mongoose.helper';
import vars from '../../config/vars';
import User from '../../models/User';
import { isSuperAdmin } from '../helpers/authHelper';
import { _MSG } from '../../utils/messages';

export async function sendOrganizations(req: RequestCustom, res: Response) {
  try {
    const user = await User.findById(req.user._id).lean();
    const spaces = await Space.find({ _id: { $in: user.rootSpaces } }).lean();

    const organizationIds = spaces.map((space) => space.organization);
    // super admin gets all organizations, other users get only their organizations
    const query = isSuperAdmin(user) ? {} : { _id: { $in: organizationIds } };
    // TEST CODE const query = { _id: { $in: ['6444f0a8c9243bfee443c53e', '643861526aec086124b0e0e7', '6432ceb45647e578ce20f896'] } };

    const data = await Organization.find(query).lean();

    res.status(httpStatus.OK).json({
      success: true,
      collection: 'organizations',
      data: data
    });
  } catch (error) {
    logger.error(error.message || error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message || error });
  }
}

/**
 *
 * check if the user has the organization
 *
 * 1.clear space cookie
 * 2. set organization cookie
 * 3. send main/root spaces of the organization to show in the select input
 * 4. show all the contents of the organization until select space
 *
 *  */
export async function organizationSelected(req: RequestCustom, res: Response) {
  try {
    const user = await User.findById(req.user._id);
    if (!user.hasOrganization(req.params.organizationId)) {
      throw new Error(_MSG.NOT_AUTHORIZED);
    }

    res.clearCookie('space', { domain: vars.cookieDomain });
    res.cookie('organization', req.params.organizationId, { domain: vars.cookieDomain });
    const spaces = await Space.find({ organization: req.params.organizationId, isMain: true }).lean();

    res.status(httpStatus.OK).json({
      success: true,
      collection: 'organizations',
      data: spaces
    });
  } catch (error) {
    logger.error(error.message || error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message || error });
  }
}

export async function sendOrganizationsSelectionForSuperAdmin(req: RequestCustom, res: Response) {
  try {
    const data = await Organization.find({});
    res.clearCookie('space', { domain: vars.cookieDomain });
    res.status(httpStatus.OK).json({
      success: true,
      collection: 'organizations',
      data: data
    });
  } catch (error) {
    logger.error(error.message || error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message || error });
  }
}

export async function deleteOrganizationByIdWithPagination(req: RequestCustom, res: Response) {
  try {
    const foundSpace = await Space.find({
      organization: {
        $in: req.params.organizationId
      }
    })
      .limit(1)
      .lean();

    if (foundSpace.length) {
      throw new Error('This organization has spaces. Please delete them first.');
    }
    const deletedOrganization = await Organization.findByIdAndDelete(req.params.organizationId);

    const data = await aggregateWithPagination(req.query, 'organizations');

    res.status(httpStatus.OK).json({
      success: true,
      collection: 'organizations',
      data: data[0].paginatedResult || [],
      deletedCount: deletedOrganization ? 1 : 0,
      totalDocuments: data[0].counts[0]?.total || 0
    });
  } catch (error) {
    logger.error(error.message || error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message || error });
  }
}

export async function deleteOrganizationById(req: RequestCustom, res: Response) {
  try {
    const foundSpace = await Space.find({
      organization: {
        $in: req.params.organizationId
      }
    })
      .limit(1)
      .lean();

    if (foundSpace.length) {
      throw new Error('This organization has spaces. Please delete them first.');
    }
    const deletedOrganization = await Organization.findByIdAndDelete(req.params.organizationId);

    res.status(httpStatus.OK).json({
      success: true,
      collection: 'organizations',
      data: deletedOrganization,
      deletedCount: deletedOrganization ? 1 : 0
    });
  } catch (error) {
    logger.error(error.message || error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message || error });
  }
}
