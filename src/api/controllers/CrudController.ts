import mongoose from 'mongoose';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import logger from '../../config/logger';

import MSG, { _MSG } from '../../utils/messages';
import { cutQuery, deleteEmptyFields, getEntity, getEntityFromOriginalUrl, getSplittedPath } from '../../utils/functions';
import { RequestCustom } from '../../types/custom-express/express-custom';

//= ===============================================================================
// CRUD GENERIC CONTROLLER METHODS
//= ===============================================================================

export const getPublicCrudObjects = async (req: Request, res: Response) => {
  try {
    const entity = req.params.entity || getSplittedPath(cutQuery(req.url))[2];
    req.params.entity = entity;

    const Model = mongoose.model(entity);
    const data = await Model.find<MongooseBaseModel<any, any>>(req.query).sort({
      createdAt: -1
    });

    if (data.length) {
      if (data[0].setStorageUrlToModel) {
        for (const item of data) {
          await item.setStorageUrlToModel();
        }
      }
    }

    res.status(httpStatus.OK).json({
      success: true,
      collection: entity,
      data: data,
      totalDocuments: data.length
    });
  } catch (err) {
    res.status(err).json({
      message: err.message || err
    });
  }
};

export const sendCrudDocumentsToClient = async (req: Request, res: Response) => {
  try {
    const entity = req.params.entity || getSplittedPath(cutQuery(req.url))[2];
    // req.params.entity = entity;

    const Model = mongoose.model(entity);

    const data = await Model.find<MongooseBaseModel<any, any>>(req.query).sort({
      createdAt: -1
    });

    res.status(httpStatus.OK).json({
      success: true,
      collection: entity,
      data: data,
      totalDocuments: data.length
    });
  } catch (err) {
    res.status(err).json({
      message: err.message || err
    });
  }
};

export const sendCrudObjectToLoggedClient = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new Error(_MSG.NOT_AUTHORIZED);
    }
    const entity = req.params.entity || getEntityFromOriginalUrl(req.originalUrl);
    req.params.entity = entity;

    //  TODO: use req.query for querying in find method and paginating. maybe need to delete field to query in find method
    const Model = mongoose.model(entity);

    const data = await Model.find(req.query);

    res.status(httpStatus.OK).json({
      success: true,
      collection: entity,
      data: data,
      totalDocuments: data.length
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
    const data: any[] = await mongoose.model(entity).findById(req.params.idMongoose);
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

export const createCrudObject = async (req: RequestCustom, res: Response) => {
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

// update is universal. API response back without pagination. always res back with updated object.
export const updateCrudObjectById = async (req: Request, res: Response) => {
  try {
    const { idMongoose } = req.params;
    const entity = req.params.entity || getEntity(req.url);
    const foundModel = await mongoose.model(entity).findById(idMongoose);

    foundModel.set(req.body);
    const updatedModel = await foundModel.save();
    res.status(httpStatus.OK).json({
      success: true,
      message: _MSG.OBJ_UPDATED,
      collection: entity,
      data: updatedModel,
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
export const deleteCrudObjectById = async (req: Request, res: Response) => {
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

    res.status(httpStatus.OK).json({
      success: true,
      message: _MSG.OBJ_DELETED,
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

// export async function sendEmail(req: Request, res: Response) {
//   try {
//     let testAccount = await nodemailer.createTestAccount();

//     // create reusable transporter object using the default SMTP transport
//     // let transporter = nodemailer.createTransport({
//     //   host: 'smtp.ethereal.email',
//     //   port: 587,
//     //   secure: false, // true for 465, false for other ports
//     //   auth: {
//     //     user: testAccount.user, // generated ethereal user
//     //     pass: testAccount.pass // generated ethereal password
//     //   }
//     // });
//     // const transporter = nodemailer.createTransport({
//     //   service: 'gmail',
//     //   auth: {
//     //     user: '', // your Gmail account
//     //     pass:  // your Gmail password
//     //   }
//     // });

//     //     let transporter = nodemailer.createTransport({
//     //   host: "smtp.gmail.com",
//     //   port: 465,
//     //   secure: true,
//     //   auth: {
//     //     type: "OAuth2",
//     //     user: "",
//     //     accessToken: "",
//     //   },
//     // });
//     let transporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com',
//       port: 465,
//       secure: true,
//       auth: {
//         type: 'OAuth2',
//         clientId: '',
//         clientSecret: ''
//       }
//     });
//     const DESTINATION = 'yujisato.usk.jpn@gmail.com';
//     const FLATMATES_EMAIL = 'flatmates.2023@gmail.com';
//     // Create a mailOptions object
//     const mailOptions = {
//       from: 'Administration Flatmates <flatmates.administration@gmail.com>', // sender address
//       to: DESTINATION, // list of receivers
//       subject: 'Test email from Node.js', // Subject line
//       html: '<p>Hi there,</p><p>This is a test email sent from Node.js using Nodemailer.</p>',
//       auth: {
//         user: FLATMATES_EMAIL,
//         ref: ''
//       } // HTML body
//     };
//     // send mail with defined transport object
//     const info = await transporter.sendMail(mailOptions);
//     // , function(error, info)
//     // {
//     //   if(error){
//     //     console.log(error);
//     //   }else{
//     //     console.log('Email sent: ' + info.response);
//     //   }

//     console.log('Message sent: %s', info.messageId);
//     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//     // Preview only available when sending through an Ethereal account
//     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
//   } catch (error) {}
// }

export default {
  // sendCrudObjectsWithPaginationToClient,
  sendCrudDocumentsToClient,
  createCrudObject,
  deleteCrudObjectById,
  updateCrudObjectById,
  getSingleCrudObject
};
