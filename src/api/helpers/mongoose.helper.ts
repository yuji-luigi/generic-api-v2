import { Request, Response } from 'express';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import logger from '../../config/logger';
import { deleteEmptyFields, getEntity } from '../../utils/functions';
import MSG from '../../utils/messages';

/*
 * genetic creation of mongoose model
 * */
exports.mongooseCreation = async function (req: Request, entity: string) {
  try {
    req.body = deleteEmptyFields(req.body);
    const Model = mongoose.model(entity);
    const newModel =  new Model(req.body);
    const result = await newModel.save();
    return result;
  } catch (err) {
    logger.error(err.message || err);
    throw err;
  }
};

/**
 * @param {Object} updates - updates to be made to the model
 * @param {String} entity - name of the entity
 * @returns {updatedModel}
 */

exports.mongooseUpdate = async function (updates: any, entity: string, idMongoose: string) {
  try {
    updates = deleteEmptyFields(updates);
    const foundModel = await mongoose.model(entity).findById(idMongoose);
    if (!foundModel) {
      throw new Error(MSG({ entity, id: idMongoose }).NOT_FOUND_ID);
    }
    foundModel.set(updates);
    const updatedModel = await foundModel.save();
    return updatedModel;
  } catch (err) {
    logger.error(err.message || err);
    throw err;
  }
};

exports.mongooseDeleteById = async function (req: Request, res: Response, entity: string, id: string) {
  try {
    let { idMongoose } = req.params;
    idMongoose = idMongoose || id;
    const entity = req.params.entity || getEntity(req.url);
    const { deletedCount } = await mongoose
      .model(entity)
      .deleteOne({ _id: idMongoose });
    if (deletedCount === 0) {
      return res.status(httpStatus.NO_CONTENT).json({
        success: false,
        collection: entity,
        count: 0
      });
    }
    res.status(httpStatus.OK).json({
      success: true,
      collection: entity,
      count: 1
    });
  } catch (err) {
    logger.error(err.message || err);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: err.message || err });
  }
};
