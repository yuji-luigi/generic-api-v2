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
  // async sendSpecificStorageUrl(req: Request, res: Response) {
  //   const signedUrlExpireSeconds = 60 * 5;

  //   const params = {
  //     Bucket: storageBucketName,
  //     Key: req.params.folder
  //       ? `${req.params.folder}/${req.params.key}`
  //       : req.params.key,
  //     Expires: signedUrlExpireSeconds
  //   };

  //   const response = s3.getSignedUrl('getObject', params);
  //   const data = await streamToString(response.Body);
  //   writeFileSync('/tmp/local-file.ext', data);
  //   console.log('Success', data);
  //   // return data;
  //   // logger.info(url);
  //   res.send(data);
  //   // res.status(httpStatus.OK).json({
  //   //     success: true,
  //   //     collection: 'storage, not collection',
  //   //     data: url
  //   // });
  // },

  // async showDataOnScreen(req: Request, res: Response) {
  //   const bucketParams = this.getParams(req.params);

  //   s3.getObject(bucketParams, (err, data) => {
  //     if (err) {
  //       res.status(200);
  //       res.end('Error Fetching File');
  //     } else {
  //       res.attachment(bucketParams.Key); // Set Filename
  //       res.type(data.ContentType); // Set FileType
  //       res.send(data.Body); // Send File Buffer
  //     }
  //   });
  // },

  async postResourceIntoStorage(req: Request, res: Response) {
    try {
      const { forSingleField } = req.body;
      const [filesToUpload, existingFilesId] = separateFiles(
        req.files.file,
        req.files as any
      );
      const uploadModelsData = await saveInStorage(
        filesToUpload,
        req.body.folderName
      );
      // ok, with reference of existing files
      const uploadModelIds = existingFilesId;
      for (const key in uploadModelsData) {
        const createdModel = await Upload.create(uploadModelsData[key]);
        uploadModelIds.push(createdModel._id.toString());
      }
      res.status(httpStatus.OK).json({
        success: true,
        data: forSingleField ? uploadModelIds[0] : uploadModelIds,
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

  // getParams(params: any, getLogoData: any = null) {
  //   if (getLogoData) {
  //     const s3params = {
  //       Bucket: storageBucketName,
  //       Key: `${getLogoData.entity}/${getLogoData.idLogo}`
  //     };
  //     return s3params;
  //   }
  //   const s3params = {
  //     Bucket: storageBucketName,
  //     Key: params.key
  //   };
  //   return s3params;
  // }
};

export default uploadFilesController;
