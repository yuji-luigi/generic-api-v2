import mongoose from 'mongoose';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import logger from '../../config/logger';

import MSG from '../../utils/messages';
import { deleteEmptyFields, getEntity } from '../../utils/functions';

//= ===============================================================================
// CRUD GENERIC CONTROLLER METHODS
//= ===============================================================================

export const getCrudObjects = async (
  req: Request,
  res: Response,
) => {
  try {
    const entity = req.params.entity || getEntity(req.url);
    req.params.entity = entity;
    // const { page = 1, limit = 10 }: {page: number, limit: number} = req.query;
    // TODO: litmit will be sent by the client in the query params
    const limit = 10;

    //  TODO: use req.query for querying in find method and paginating. maybe need to delete field to query in find method
    const  {query} = req;
    /** define skip value, then delete as follows */
    let skip = +query.skip -1 <= 0 ? 0 : +query.skip * limit;
    skip = isNaN(skip) ? 0 : skip;
    delete query.skip;

    // const data = await mongoose.model(entity).find(req.query);
    // const data = await mongoose.model(entity).find( { createdOn: { $lte: 10 } } )
    //   .limit(limit * 1)
    //   .skip((page - 1) * limit)
    //   .exec();

    // const found = await mongoose.model(entity).find({name: 'Microsoft'});

    const data = await mongoose.model(entity).aggregate([{
      $facet: {
        paginatedResult: [
          {$match: query },
          {$skip: skip},
          {$limit: limit}
        ],

        counts:[
          {$match: query},
          {$count: 'total'}
        ]
      }
    }]);

    res.status(httpStatus.OK).json({
      success: true,
      collection: entity,
      documents: data[0].paginatedResult || [],
      totalDocuments: data[0].counts[0]?.total || 0
    });
  } catch (err) {
    res.status(err).json({
      message: err.message || err
    });
  }
};

export const getSingleCrudObject = async (req: Request, res: Response) => {
  try {
    const entity = req.params.entity || getEntity(req.url);
    req.params.entity = entity;
    const data: any[] = await mongoose
      .model(entity)
      .findById(req.params.idMongoose);
    res.status(httpStatus.OK).json({
      success: true,
      collection: entity,
      data,
      count: data.length
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: err.message || err
    });
  }
};

export const createCrudObject = async (req: Request, res: Response) => {
  try {
    // get req.params.entity
    const entity = req.params.entity || getEntity(req.url);
    req.body = deleteEmptyFields(req.body);
    const Model = mongoose.model(entity);
    const newModel = new Model(req.body);
    await newModel.save();
    res.status(httpStatus.CREATED).json({
      success: true,
      collection: entity,
      data: newModel,
      count: 1
    });
  } catch (err) {
    logger.error(err.message || err);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: err.message || err });
  }
};

export const updateCrudObjectById = async (req: Request, res: Response) => {
  try {
    const { idMongoose } = req.params;
    const entity = req.params.entity || getEntity(req.url);
    const foundModel = await mongoose.model(entity).findById(idMongoose);

    foundModel.set(req.body);
    const updatedModel = await foundModel.save();
    res.status(httpStatus.OK).json({
      success: true,
      message: MSG().OBJ_UPDATED,
      collection: entity,
      data: updatedModel,
      count: 1
    });
  } catch (err) {
    logger.error(err.message || err);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: err.message || err });
  }
};

/**
 * TODO: response new 10 documents array of that page
 * Need to know: "pageNumber", "skip", like normal get route.
 */
export const deleteCrudObjectById = async (req: Request, res: Response) => {
  try {
    const { idMongoose } = req.params;
    const entity: string = req.params.entity || getEntity(req.url);
    const { deletedCount } = await mongoose
      .model(entity)
      .deleteOne({ _id: idMongoose });
    if (deletedCount === 0) {
      return res.status(httpStatus.NO_CONTENT).json({
        success: false,
        message: MSG({ entity, id: idMongoose }).OBJ_NOT_FOUND,
        collection: entity,
        count: deletedCount
      });
    }
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
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: err.message || err });
  }
};

export default {
  getCrudObjects,
  createCrudObject,
  deleteCrudObjectById,
  updateCrudObjectById,
  getSingleCrudObject
};
