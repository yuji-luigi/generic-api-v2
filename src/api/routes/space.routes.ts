import express from 'express';
import { ADMIN, isLoggedIn, LOGGED_USER, SUPER_ADMIN } from '../../middlewares/auth';
import { checkEntity } from '../../middlewares/checkEntity';
import CrudController, { getPublicCrudObjects, sendCrudObjectToLoggedClient } from '../controllers/CrudController';
import {
  createHeadSpace,
  getLinkedChildrenSpaces,
  sendHeadSpaces,
  deleteLinkedChildSpace,
  deleteHeadSpace,
  sendSpaceAsCookie,
  sendSpaceSelectionToClient,
  createLinkedChildSpace
} from '../controllers/SpaceController';
import postController from '../controllers/PostController';

import DataTableController, { sendLinkedChildrenWithPaginationToClient } from '../controllers/DataTableController';
import { createLinkedChild } from '../controllers/CrudCustomController';
const router = express.Router();

/**
 * SPACES
 */
// DATA TABLE
router.get('/', isLoggedIn(), sendCrudObjectToLoggedClient);
// router.get('/with-pagination', isLoggedIn(), (req, res) => {
//   console.log('fdji');
//   res.send('Hello World!');
// });
router.get('/with-pagination', isLoggedIn(), DataTableController.sendCrudObjectsWithPaginationToClient);
router.get('/with-pagination/linkedChildren/:parentId', isLoggedIn(), sendLinkedChildrenWithPaginationToClient);

router.post('/with-pagination/linkedChildren/:parentId', isLoggedIn(), createLinkedChild);

router.get('/selections', isLoggedIn(), sendSpaceSelectionToClient);

router.delete('/:id', checkEntity, isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]), deleteHeadSpace);

// CUSTOM crud ROUTES
router.post('/', checkEntity, isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]), createHeadSpace);
router.get('/get-cookie/:spaceId', isLoggedIn(), sendSpaceAsCookie);

export default router;
