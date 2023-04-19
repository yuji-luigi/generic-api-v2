import { SUPER_ADMIN } from '../../middlewares/auth';
import express, { Request, Response } from 'express';

const router = express.Router();
import dataTableCtrl from '../controllers/DataTableController';
import { isLoggedIn, ADMIN, LOGGED_USER } from '../../middlewares/auth';
import { checkEntity } from '../../middlewares/checkEntity';
import CrudController from '../controllers/CrudController';

router.get('/', (req: Request, res: Response) => {
  res.send('API is working');
});

/**
 * SPACES
 */

/**
 * USERS
 */
router.post('/users', checkEntity, isLoggedIn([ADMIN, SUPER_ADMIN]), dataTableCtrl.createCrudObjectAndSendDataWithPagination);

/**
 * CUSTOMERS
 */
router.post('/customers', checkEntity, isLoggedIn([SUPER_ADMIN]), CrudController.createCrudObject);

router.delete(
  '/linkedChildren/:entity/:id',
  checkEntity,
  isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]),
  dataTableCtrl.deleteCrudObjectByIdAndSendDataWithPagination
);

//! GENERIC crud routes FOR DATA TABLE
router.get('/:entity', checkEntity, isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]), dataTableCtrl.sendCrudObjectsWithPaginationToClient);

router.post('/:entity', checkEntity, isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]), dataTableCtrl.createCrudObjectAndSendDataWithPagination);

router.delete(
  '/:entity/:idMongoose',
  checkEntity,
  isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]),
  dataTableCtrl.deleteCrudObjectByIdAndSendDataWithPagination
);

export default router;
