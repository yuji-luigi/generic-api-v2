import mongoose from 'mongoose';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import logger from '../../config/logger';

import MSG from '../../utils/messages';
import { cutQuery, deleteEmptyFields, getEntity, getEntityFromOriginalUrl, getSplittedPath } from '../../utils/functions';
import { RequestCustom } from '../../types/custom-express/express-custom';
import { LOOKUP_QUERY, aggregateWithPagination } from '../helpers/mongoose.helper';

//= ===============================================================================
// CRUD DATA TABLE CONTROLLER METHODS
//= ===============================================================================

export const sendCrudObjectsWithPaginationToClient = async (req: RequestCustom, res: Response) => {
  try {
    const entity = req.params.entity || getEntityFromOriginalUrl(req.originalUrl);
    req.params.entity = entity;

    const limit = 10;

    //  TODO: use req.query for querying in find method and paginating. maybe need to delete field to query in find method
    const { query } = req;
    const data = await aggregateWithPagination(query, entity);
    /** define skip value, then delete as follows */
    // let skip = +query.skip - 1 <= 0 ? 0 : (+query.skip - 1) * limit;
    // skip = isNaN(skip) ? 0 : skip;
    // delete query.skip; // not good way for functional programming. set new query object for querying the DB
    // delete query.limit;
    // for (const key in query) {
    //   query[key] === 'true' ? (query[key] = true) : query[key];
    //   query[key] === 'false' ? (query[key] = false) : query[key];
    // }
    // const data = await mongoose.model(entity).aggregate([
    //   {
    //     $facet: {
    //       paginatedResult: [{ $match: query || {} }, { $skip: skip }, { $limit: limit }, ...LOOKUP_QUERY[entity]],

    //       counts: [{ $match: query }, { $count: 'total' }]
    //     }
    //   }
    // ]);

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
    // return sendCrudObjectsWithPaginationToClient(req, res);
    const data = await aggregateWithPagination(req.query, entity);

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
    /** pass to sendCrudObjectsWithPaginationToClient to send the updated (deleted array) */
    // return sendCrudObjectsWithPaginationToClient(req, res);
    const data = await aggregateWithPagination(req.query, entity);

    res.status(httpStatus.OK).json({
      success: true,
      collection: entity,
      data: data[0].paginatedResult || [],
      totalDocuments: data[0].counts[0]?.total || 0
    });
  } catch (err) {
    logger.error(err.message || err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message || err });
  }
};

export const sendLinkedChildrenWithPaginationToClient = async (req: Request, res: Response) => {
  try {
    //! set pagination logic here and next > parentId page set the pagination logic
    const { parentId } = req.params;
    const entity = req.params.entity || getEntityFromOriginalUrl(req.originalUrl);
    // const children = await mongoose.model(entity).find({parentId: parentId});x
    req.query.parentId = parentId;
    const data = await aggregateWithPagination(req.query, entity);
    res.status(httpStatus.OK).json({
      success: true,
      collection: entity,
      data: data[0].paginatedResult || [],
      totalDocuments: data[0].counts[0]?.total || 0
    });
  } catch (err) {
    logger.error(err.message || err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message || err });
  }
};

//! TODO: from next chose to call generic parameter route
export const deleteLinkedChildByIdWithPagination = async (req: Request, res: Response) => {
  try {
    /**
     * find model
     * create model with parentId in the correct field
     * save
     * send the data array to handle in redux
     */
    let { entity } = req.params;
    const { idMongoose } = req.params;
    const deletedDocument = await mongoose.model(entity).findOneAndDelete({ _id: idMongoose });
    const query = {
      ...req.query,
      parentId: deletedDocument.parentId
    };
    const data = await aggregateWithPagination(query, entity);

    res.status(httpStatus.OK).json({
      success: true,
      collection: entity,
      data: data[0].paginatedResult || [],
      totalDocuments: data[0].counts[0]?.total || 0
    });
  } catch (err) {
    logger.error(err.message || err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message || err });
  }
};

export default {
  sendCrudObjectsWithPaginationToClient,
  createCrudObjectAndSendDataWithPagination,
  deleteCrudObjectByIdAndSendDataWithPagination,
  deleteLinkedChildByIdWithPagination
};
