import express from 'express';
import { ADMIN, isLoggedIn, LOGGED_USER, SUPER_ADMIN } from '../../middlewares/auth';
import { checkEntity } from '../../middlewares/checkEntity';
import {createHeadSpace} from '../controllers/CrudCustomController';

const router = express.Router();
// import crudCustomCtrl from '../controllers/CrudCustomController';
// import crudCtrl from '../controllers/CrudController';
// import { isLoggedIn, ADMIN, LOGGED_USER } from '../../middlewares/auth';

// CUSTOM crud ROUTES
router.post(
  '/spaces',
  checkEntity,
  isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]),
  createHeadSpace
);

export default router;
