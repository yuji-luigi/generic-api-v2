// Imports your configured client and any necessary S3 commands.

import { S3, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

// import { uuid } from 'uuidv4';
import logger from '../../config/logger';
import vars from '../../config/vars';
import { formatDateASCII } from '../../utils/functions';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';

const {
  storageAccessKeyId,
  storageSecretAccessKey,
  storageBucketName,
  storageEndPoint,
  storageRegion
} = vars;

export const s3Client = new S3({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  region: storageRegion,
  endpoint: storageEndPoint,
  credentials: {
    accessKeyId: storageAccessKeyId,
    secretAccessKey: storageSecretAccessKey
  }
});

export const saveInStorage = async function (
  filesData: any,
  folderName = ''
  // forSingleField = false
) {
  try {
    const dateNow = new Date();
    const dateASCII = formatDateASCII(dateNow);
    // const today = formatDateByDash(dateNow);
    // o(n)...🤣
    const result = [];

    for (const key in filesData) {
      // creation of new variables
      const file = filesData[key];
      file.folderName = folderName; // get file
      const uploadModelData = createUploadModelData(file, dateASCII);
      // define full path
      const bucketParams = getBucketParams(file, uploadModelData.fullPath);
      await s3Client.send(new PutObjectCommand(bucketParams));

      result.push(uploadModelData);
    }

    return result;
  } catch (error) {
    // const errorMessage = `Error in saveInStorage function in storageHelper. message:${
    //   error.message || error
    // }`;
    logger.error(error.message || error);
    throw error;
  }
};

export const getBucketParams = (data: any, fullPath: string) =>
  // const { folderName, fileName } = data;

  // const key = folderName ? `${folderName}/${fileName}` : fileName; // include folder name in the key if it's provided

  ({
    Bucket: storageBucketName,
    Key: fullPath,
    Body: data.data,
    ContentType: data.mimetype,
    ContentLength: `${data.size}` as unknown as number
    // Metadata: {
    //   mimetype: data.mimetype,
    //   original_filename: data.name,
    //   size: `${data.size}`
    // }
  });
export function createUploadModelData(file: any, dateASCII: any) {
  // const gui = uuid(); // generate uuid
  const extension = file.name.split('.').pop(); // get file extension
  // const newFileName = `${dateASCII}_${gui}_${file.name}`; // define new file name with uuid and date
  const newFileName = `${dateASCII}_${file.name}`; // define new file name with uuid and date

  const fullPath = file.folderName
    ? `${file.folderName}/${newFileName}`
    : newFileName; // define full path

  // const fullPath = `${file.folderName}/${newFileName}`; // define full path
  return {
    fileName: newFileName,
    originalFileName: file.name,
    folder: file.folderName,
    extension,
    fullPath,
    size: file.size / 1000
  };
}

// Function to turn the file's body into a string.
// export const streamToString = (stream: any) => {
//   const chunks: [] = [];
//   // eslint-disable-next-line no-undef
//   return new Promise((resolve, reject) => {
//     stream.on('data', (chunk: any) => chunks.push(Buffer.from(chunk) ));
//     stream.on('error', (err: any) => reject(err));
//     stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
//   });
// };

export const streamToString = (stream: Readable): Promise<string> => {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err: Error) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
};

export const getPrivateUrlOfSpace = async function (obj: any) {
  const signedUrlExpireSeconds = 60 * 5;
  const params = {
    Bucket: storageBucketName,
    Key: obj.params.folder
      ? `${obj.params.folder}/${obj.params.key}`
      : obj.params.key,
    Expires: signedUrlExpireSeconds
  };
  const url = await getSignedUrl(s3Client, new GetObjectCommand(params), {
    expiresIn: 60 * 60
  });
  return url;
};

export const separateFiles = function (file: any, files: any[]) {
  if (files) {
    const filesToUpload = [];
    const existingFilesId = [];
    for (const key in files) {
      const file = files[key];
      if (typeof file == 'object') {
        filesToUpload.push(file);
        continue;
      }
      if (typeof file == 'string') {
        existingFilesId.push(file);
        continue;
      }
    }
    // const fileToUpload = file.filter(file => typeof file == 'object');
    // const existingFilesId = file.filter(file => typeof file == 'string');
    return [filesToUpload, existingFilesId];
  }
  /** case for single file. so only one value */
  if (typeof file == 'object') {
    return [[file], []];
  }
  if (typeof file == 'string') {
    return [[], [file]];
  }
  return [[], []];
};
