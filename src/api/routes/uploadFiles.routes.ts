import express from 'express';
import uploadFileController from '../controllers/UploadFilesController';

const router = express.Router();

router.post('/', uploadFileController.postResourceIntoStorage);

export default router;
