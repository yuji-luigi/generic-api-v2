import express from 'express';
import { ADMIN, isLoggedIn, LOGGED_USER, SUPER_ADMIN } from '../../middlewares/auth';
import { checkEntity } from '../../middlewares/checkEntity';
import CrudController, { getPublicCrudObjects } from '../controllers/CrudController';
import {
  createHeadSpace,
  createLinkedChild,
  getLinkedChildren,
  sendHeadDocuments,
  deleteLinkedChild,
  deleteHeadSpace
} from '../controllers/CrudCustomController';
import postController from '../controllers/PostController';
const router = express.Router();
// import crudCustomCtrl from '../controllers/CrudCustomController';
// import crudCtrl from '../controllers/CrudController';
// import { isLoggedIn, ADMIN, LOGGED_USER } from '../../middlewares/auth';

// router.get(
//   '/linkedChildren/:entity/:parentId',
//   (req, res) => {
//     res.json({collection: 'response is here'});
//   }

// );

/**
 * SPACES
 */
router.get('/spaces', isLoggedIn(), sendHeadDocuments);

router.delete('/spaces/:id', checkEntity, isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]), deleteHeadSpace);

/**
 * USERS
 */

router.post('/users', checkEntity, isLoggedIn([ADMIN, SUPER_ADMIN]), CrudController.createCrudObject);
router.post('/users/:idMongoose', checkEntity, isLoggedIn([ADMIN, SUPER_ADMIN]), CrudController.updateCrudObjectById);

/**
 * CUSTOMERS
 */
router.post('/customers', checkEntity, isLoggedIn([SUPER_ADMIN]), CrudController.createCrudObject);
router.post('/customers/:idMongoose', checkEntity, isLoggedIn([SUPER_ADMIN]), CrudController.updateCrudObjectById);

router.delete('/linkedChildren/:entity/:id', checkEntity, isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]), deleteLinkedChild);

/**
 *  POSTS
 */
router.post('/threads', checkEntity, isLoggedIn(), postController.createThread);

router.get('/threads', checkEntity, isLoggedIn(), postController.sendThreadToFrondEnd);
router.get('/threads/:threadId', checkEntity, isLoggedIn(), postController.sendSingleThreadToFrondEnd);
router.delete('/threads/:threadId', checkEntity, isLoggedIn(), postController.deleteThread);
/**
 * LINKED CHILDREN
 */
router.get('/linkedChildren/:entity/:parentId', checkEntity, isLoggedIn(), getLinkedChildren);
router.post('/linkedChildren/:entity/:parentId', checkEntity, isLoggedIn([ADMIN, SUPER_ADMIN]), createLinkedChild);
// CUSTOM crud ROUTES
router.post('/spaces', checkEntity, isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]), createHeadSpace);

router.get('/uploads', isLoggedIn([SUPER_ADMIN]), CrudController.getCrudObjects);

/**
 * PUBLIC ROUTES
 *  */
// todo: available only certain entities
router.get('/public/threads', getPublicCrudObjects);
router.get('/public/spaces', getPublicCrudObjects);
router.get('/public/aaa', getPublicCrudObjects);

export default router;
