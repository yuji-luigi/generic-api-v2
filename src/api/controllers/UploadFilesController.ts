/**
 * *************************************
 *  SHADAPPS CONFIDENTIAL
 *  __________________
 *
 *  Created by Vittorio Tauro
 *
 *  2021 (c) ShadApps Srl
 *  All Rights Reserved.
 *
 *  NOTICE:  All information contained herein is, and remains
 *  the property of ShadApps Srl and its suppliers,
 *  if any. The intellectual and technical concepts contained
 *  herein are proprietary to ShadApps Srl.
 *  and its suppliers and may be covered by Italian, European and Foreign Patents,
 *  patents in process, and are protected by trade secret or copyright law.
 *  Dissemination of this information or reproduction of this material
 *  is strictly forbidden unless prior written permission is obtained
 *  from ShadApps Srl.
 * *************************************
 * */

// const AWS = require('aws-sdk')

// import { writeFileSync } from 'fs';

import {
  // s3Client as s3,
  // streamToString,
  saveInStorage,
  getPrivateUrlOfSpace,
  separateFiles
} from '../helpers/uploadFileHelper';

import httpStatus from 'http-status';
import Upload from '../../models/Upload';
import logger from '../../config/logger';
// import vars from '../../config/vars';
import { Request, Response } from 'express';
import { replaceSlash, replaceSpaces } from '../../utils/functions';
// const { storageBucketName } = vars;

const uploadFilesController = {
  async getResourceFromStorage(req: Request, res: Response) {
    try {
      const url = await getPrivateUrlOfSpace(req);
      res.send(url);
    } catch (error) {
      logger.error(error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        collection: 'storage',
        message: `getResourceFromStorage function. Error:${
          error.message || error
        }`
      });
    }
  },

  async postResourceIntoStorage(req: Request, res: Response) {
    try {
      // const { forSingleField } = req.body;
      const [filesToUpload, existingFilesId] = separateFiles(req.files);
      const formattedOwnerName = replaceSlash(
        replaceSpaces(req.user.owner.name, '_')
      );
      const ownerNameId = `${formattedOwnerName}_${req.user.owner._id}`;
      const folderNameInBody = req.body.folderName
        ? `/${req.body.folderName}`
        : '';
      const generalDirName = ownerNameId + folderNameInBody;
      const uploadModelsData = await saveInStorage(
        filesToUpload,
        generalDirName
      );
      // ok, with reference of existing files
      const uploadModelIds = existingFilesId;
      for (const key in uploadModelsData) {
        const createdModel = await Upload.create(uploadModelsData[key]);
        uploadModelIds.push(createdModel._id.toString());
      }
      res.status(httpStatus.OK).json({
        success: true,
        data: /* forSingleField ? uploadModelIds[0] : */ uploadModelIds,
        collection: 'storage'
      });
    } catch (error) {
      logger.error(error.message || error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        success: false,
        collection: 'storage'
      });
    }
  }
};

export default uploadFilesController;
