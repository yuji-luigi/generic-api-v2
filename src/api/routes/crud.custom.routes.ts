import express from 'express';
import { ADMIN, isLoggedIn, LOGGED_USER, SUPER_ADMIN } from '../../middlewares/auth';
import { checkEntity } from '../../middlewares/checkEntity';
import {createHeadSpace, createLinkedChild, getLinkedChildren, sendHeadDocuments, deleteLinkedChild, deleteHeadSpace} from '../controllers/CrudCustomController';

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
// router.get(
//   '/linkedChildren/:entity/:parentId',
//   (req, res) => {
//     res.json({collection: 'response is here'});
//   }

// );

router.get(
  '/spaces',
  isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]), sendHeadDocuments
);
router.get(
  '/linkedChildren/:entity/:parentId',
  checkEntity,
  isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]), getLinkedChildren

);
router.post(
  '/linkedChildren/:entity/:parentId',
  checkEntity,
  isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]), createLinkedChild
);

router.delete(
  '/spaces/:id',
  checkEntity,
  isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]), deleteLinkedChild
);

router.delete(
  '/linkedChildren/:entity/:id',
  checkEntity,
  isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]), deleteLinkedChild
);
router.delete(
  '/spaces/:id',
  checkEntity,
  isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]), deleteHeadSpace
);
// router.put(
//   '/linkedChildren/:entity/:documentId/:parentId',
//   checkEntity,
//   isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]), (req, res) => {
//     console.log('update?');
//     console.log(req.body);
//     res.send('od');}

// );

export default router;
