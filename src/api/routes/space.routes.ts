import express, { Request, Response } from 'express';
import { ADMIN, isLoggedIn, LOGGED_USER, SUPER_ADMIN } from '../../middlewares/auth';
import CrudController, { getPublicCrudObjects, sendCrudObjectToLoggedClient } from '../controllers/CrudController';
import {
  // createHeadSpace,
  getLinkedChildrenSpaces,
  sendHeadSpaces,
  deleteLinkedChildSpace,
  sendSpaceAsCookie,
  sendSpaceSelectionToClient,
  createLinkedChildSpace,
  createHeadSpaceWithPagination,
  deleteHeadSpaceWithPagination,
  deleteSpaceCookie
} from '../controllers/SpaceController';
import postController from '../controllers/PostController';

import DataTableController, { sendLinkedChildrenWithPaginationToClient } from '../controllers/DataTableController';
import { createLinkedChild } from '../controllers/CrudCustomController';
import httpStatus from 'http-status';
const router = express.Router();

/**
 * SPACES
 */
// DATA TABLE
router.get('/', isLoggedIn(), sendCrudObjectToLoggedClient);
// router.get('/with-pagination', isLoggedIn(), (req, res) => {
//   res.send('Hello World!');
// });

router.get('/with-pagination', isLoggedIn(), DataTableController.sendCrudObjectsWithPaginationToClient);
router.get('/with-pagination/linkedChildren/:parentId', isLoggedIn(), sendLinkedChildrenWithPaginationToClient);

router.post('/with-pagination', isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]), createHeadSpaceWithPagination);
router.post('/', isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]), (req: Request, res: Response) => res.status(httpStatus.FORBIDDEN).send('forbidden'));

router.post('/with-pagination/linkedChildren/:parentId', isLoggedIn(), createLinkedChild);

router.get('/selections', isLoggedIn(), sendSpaceSelectionToClient);

// CUSTOM crud ROUTES
router.get('/cookie/:spaceId', isLoggedIn(), sendSpaceAsCookie);
router.delete('/cookie', isLoggedIn(), deleteSpaceCookie);

router.delete('/with-pagination/:spaceId', isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]), deleteHeadSpaceWithPagination);

router.delete('/:spaceId', isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]), deleteHeadSpaceWithPagination);

export default router;
