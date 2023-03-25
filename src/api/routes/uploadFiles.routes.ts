import express from 'express';
import uploadFileController from '../controllers/UploadFilesController';

const router = express.Router();

router.post('/', uploadFileController.postResourceIntoStorage);
router.delete(
  '/:modelEntity/:modelId/:uploadKey/:uploadId',
  uploadFileController.deleteFileFromStorageAndEntity
);

export default router;
