import express from 'express';
import { isLoggedIn } from '../../middlewares/auth';
import { getPublicCrudObjects } from '../controllers/CrudController';

import postController from '../controllers/PostController';
const router = express.Router();

router.post('/', isLoggedIn(), postController.createThread);

router.get('/', isLoggedIn(), postController.sendThreadToFrondEnd);
router.get('/:threadId', isLoggedIn(), postController.sendSingleThreadToFrondEnd);
router.delete('/:threadId', isLoggedIn(), postController.deleteThread);

// todo: available only certain entities
router.get('/', getPublicCrudObjects);

export default router;
