import mongoose from 'mongoose';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import logger from '../../config/logger';

import MSG from '../../utils/messages';
import { cutQuery, deleteEmptyFields, getEntity, getSplittedPath } from '../../utils/functions';
import { RequestCustom } from '../../types/custom-express/express-custom';

//= ===============================================================================
// CRUD DATA TABLE CONTROLLER METHODS
//= ===============================================================================

export const getCrudObjectsWithPagination = async (req: RequestCustom, res: Response) => {
  try {
    const entity = req.params.entity || getEntity(req.url);
    req.params.entity = entity;

    const limit = 10;

    //  TODO: use req.query for querying in find method and paginating. maybe need to delete field to query in find method
    const { query } = req;
    /** define skip value, then delete as follows */
    let skip = +query.skip - 1 <= 0 ? 0 : (+query.skip - 1) * limit;
    skip = isNaN(skip) ? 0 : skip;
    delete query.skip; // not good way for functional programming. set new query object for querying the DB
    delete query.limit;
    for (const key in query) {
      query[key] === 'true' ? (query[key] = true) : query[key];
      query[key] === 'false' ? (query[key] = false) : query[key];
    }
    const data = await mongoose.model(entity).aggregate([
      {
        $facet: {
          paginatedResult: [{ $match: query || {} }, { $skip: skip }, { $limit: limit }],

          counts: [{ $match: query }, { $count: 'total' }]
        }
      }
    ]);

    res.status(httpStatus.OK).json({
      success: true,
      collection: entity,
      data: data[0].paginatedResult || [],
      totalDocuments: data[0].counts[0]?.total || 0
    });
  } catch (err) {
    res.status(err).json({
      message: err.message || err
    });
  }
};

export const createCrudObjectAndSendDataWithPagination = async (req: RequestCustom, res: Response) => {
  try {
    // get req.params.entity
    const entity = req.params.entity || getEntity(req.url);
    req.body = deleteEmptyFields(req.body);
    req.body.user = req.user._id;
    const Model = mongoose.model(entity);
    const newModel = new Model(req.body);
    await newModel.save();
    //! Todo: handle this in frontend.
    return getCrudObjectsWithPagination(req, res);
    res.status(httpStatus.CREATED).json({
      success: true,
      collection: entity,
      data: newModel,
      count: 1
    });
  } catch (err) {
    logger.error(err.message || err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message || err });
  }
};

/**
 * TODO: response new 10 data array of that page
 * Need to know: "pageNumber", "skip", like normal get route.
 */
export const deleteCrudObjectByIdAndSendDataWithPagination = async (req: RequestCustom, res: Response) => {
  try {
    const { idMongoose } = req.params;
    const entity: string = req.params.entity || getEntity(req.url);
    const { deletedCount } = await mongoose.model(entity).deleteOne({ _id: idMongoose });
    if (deletedCount === 0) {
      return res.status(httpStatus.NO_CONTENT).json({
        success: false,
        message: MSG({ entity, id: idMongoose }).OBJ_NOT_FOUND,
        collection: entity,
        count: deletedCount
      });
    }
    /** pass to getCrudObjectsWithPagination to send the updated (deleted array) */
    return getCrudObjectsWithPagination(req, res);

    res.status(httpStatus.OK).json({
      success: true,
      message: MSG().OBJ_DELETED,
      data: { documentId: idMongoose },
      deletedCount,
      collection: entity,
      count: deletedCount
    });
  } catch (err) {
    logger.error(err.message || err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message || err });
  }
};

export default {
  getCrudObjectsWithPagination,
  createCrudObjectAndSendDataWithPagination,
  deleteCrudObjectByIdAndSendDataWithPagination
};
