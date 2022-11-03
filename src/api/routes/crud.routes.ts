import express, { Request, Response } from 'express';

const router = express.Router();
import crudCtrl from '../controllers/CrudController';
import { isLoggedIn, ADMIN, LOGGED_USER } from '../../middlewares/auth';
import { checkEntity } from '../../middlewares/checkEntity';

router.get('/', (req: Request, res: Response) => {
  res.send('API is working');
});

// GENERIC crud routes
router.get(
  '/:entity',
  checkEntity,
  isLoggedIn([ADMIN, LOGGED_USER]),
  crudCtrl.getCrudObjects
);

router.get(
  '/:entity/:idMongoose',
  checkEntity,
  isLoggedIn([ADMIN, LOGGED_USER]),
  crudCtrl.getSingleCrudObject
);

router.post(
  '/:entity',
  checkEntity,
  isLoggedIn([ADMIN, LOGGED_USER]),
  crudCtrl.createCrudObject
);

router.post(
  '/:entity/:idMongoose',
  checkEntity,
  isLoggedIn([ADMIN, LOGGED_USER]),
  crudCtrl.updateCrudObjectById
);

router.delete(
  '/:entity/:idMongoose',
  checkEntity,
  isLoggedIn([ADMIN, LOGGED_USER]),
  crudCtrl.deleteCrudObjectById
);

export default router;
