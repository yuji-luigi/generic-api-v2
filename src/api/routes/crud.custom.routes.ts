import express from 'express';
import { ADMIN, clearQueriesForSAdmin, isLoggedIn, LOGGED_USER, SUPER_ADMIN } from '../../middlewares/auth';
import { checkEntity } from '../../middlewares/checkEntity';
import CrudController, { getPublicCrudObjects } from '../controllers/CrudController';
import {
  createHeadSpace,
  createLinkedChild,
  getLinkedChildren,
  sendHeadDocuments,
  deleteLinkedChild,
  deleteHeadSpace,
  sendSpaceAsCookie
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

// /**
//  * USERS
//  */

// router.post('/users', checkEntity, isLoggedIn([ADMIN, SUPER_ADMIN]), CrudController.createCrudObject);
router.put('/users/:idMongoose', checkEntity, isLoggedIn([ADMIN, SUPER_ADMIN]), CrudController.updateCrudObjectById);

// /**
//  * CUSTOMERS
//  */
// router.post('/customers', checkEntity, isLoggedIn([SUPER_ADMIN]), CrudController.createCrudObject);
// router.post('/customers/:idMongoose', checkEntity, isLoggedIn([SUPER_ADMIN]), CrudController.updateCrudObjectById);

// router.delete('/linkedChildren/:entity/:id', checkEntity, isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]), deleteLinkedChild);

/**
 * ORGANIZATIONS
 */
router.get('/organizations', isLoggedIn([SUPER_ADMIN]), CrudController.sendCrudObjectsWithPaginationToClient);

/**
 *  POSTS
 */
// router.post('/threads', checkEntity, isLoggedIn(), postController.createThread);

// router.get('/threads', checkEntity, isLoggedIn(), postController.sendThreadsToFrondEnd);
// router.get('/threads/:threadId', checkEntity, isLoggedIn(), postController.sendSingleThreadToFrondEnd);
// router.delete('/threads/:threadId', checkEntity, isLoggedIn(), postController.deleteThread);

// router.post('/:entity', checkEntity, isLoggedIn(), postController.createThread);
// router.get('/:entity', checkEntity, isLoggedIn(), postController.sendThreadsToFrondEnd);
// router.get('/:entity/:postId', checkEntity, isLoggedIn(), postController.sendSinglePostToFrondEnd);
// router.delete('/:entity/:threadId', checkEntity, isLoggedIn(), postController.deleteThread);
/**
 * LINKED CHILDREN
 */
// DATA TABLE
router.get('/linkedChildren/:entity/:parentId', checkEntity, isLoggedIn(), getLinkedChildren);
// DATA TABLE
router.post('/linkedChildren/:entity/:parentId', checkEntity, isLoggedIn([ADMIN, SUPER_ADMIN]), createLinkedChild);

//DATA TABLE
router.delete('/linkedChildren/:entity/:linkedChildrenId/:parentId', checkEntity, isLoggedIn(), getLinkedChildren);

router.get('/uploads', isLoggedIn([SUPER_ADMIN]), CrudController.sendCrudObjectsWithPaginationToClient);

/**
 * PUBLIC ROUTES
 *  */
// todo: available only certain entities
router.get('/public/threads', getPublicCrudObjects);
router.get('/public/spaces', getPublicCrudObjects);
router.get('/public/aaa', getPublicCrudObjects);

export default router;
