import { Request, Response } from 'express';
import logger from '../../config/logger';

import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Space from '../../models/Space';
import { cutQuery, deleteEmptyFields, getEntity } from '../../utils/functions';
import { aggregateWithPagination } from '../helpers/mongoose.helper';

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
    //! set pagination logic here and next > parentId page set the pagination logic
    const {parentId, entity} = req.params;
    // const children = await mongoose.model(entity).find({parentId: parentId});
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
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: err.message || err });
  }
};
export const createLinkedChild = async (req: Request, res: Response) => {
  try {
    /**
     * find model
     * create model with parentId in the correct field
     * save
     * send the data array to handle in redux
     */
    const {parentId, entity} = req.params;
    req.body = deleteEmptyFields(req.body);
    req.body.parentId = parentId; // set the parentId in req.body
    req.body.isTail = false; // set the tail to be false.
    const Model = mongoose.model(entity);
    const newModel = new Model(req.body); // instantiate new model
    await newModel.save();

    const parentModel = await Model.findById(parentId); // find parentModel
    parentModel.isTail = false; // set isTail to false
    await parentModel.save(); // save
    // getCrudObjects(req, res);
    req.query = {...req.query, parentId};
    const data = await aggregateWithPagination(req.query, entity);
    res.status(httpStatus.OK).json({
      success: true,
      collection: entity,
      data: data[0].paginatedResult || [],
      totalDocuments: data[0].counts[0]?.total || 0
    });
    // res.status(httpStatus.CREATED).json({
    //   success: true,
    //   collection: 'spaces',
    //   data: newModel,
    //   count: 1
    // });
  } catch (err) {
    logger.error(err.message || err);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: err.message || err });
  }
};

export const sendHeadDocuments = async (req: Request, res: Response) => {
  try {
    let entity = getEntity(req.url);
    entity = cutQuery(entity);
    // without pagination
    // const children = await mongoose.model(entity).find({isHead: true});
    const query = {...req.query, isHead: true};
    const data = await aggregateWithPagination(query,entity);
    res.status(httpStatus.OK).json({
      success: true,
      collection: entity,
      data: data[0].paginatedResult || [],
      totalDocuments: data[0].counts[0]?.total || 0
    });
    // res.status(httpStatus.CREATED).json({
    //   success: true,
    //   collection: 'spaces',
    //   data: children,
    //   count: 1
    // });
  } catch (err) {
    logger.error(err.message || err);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: err.message || err });
  }
};

export const deleteLinkedChild = async (req: Request, res: Response) => {
  try {
    /**
     * find model
     * create model with parentId in the correct field
     * save
     * send the data array to handle in redux
     */
    const {id, entity} = req.params;
    id;
    // const deletedDocument = mongoose.model(entity).findOneAndDelete({_id: id});

    res.status(httpStatus.OK).json({
      success: true,
      collection: entity,
      // data: data[0].paginatedResult || [],
      // totalDocuments: data[0].counts[0]?.total || 0
    });

  } catch (err) {
    logger.error(err.message || err);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: err.message || err });
  }
};