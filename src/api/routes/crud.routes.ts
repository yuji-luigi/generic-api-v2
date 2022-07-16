import express, { Request, Response } from 'express';

const router = express.Router();
import crudCtrl from '../controllers/CrudController';
import { isLoggedIn, ADMIN, LOGGED_USER } from '../../middlewares/auth';

router.get('/', (req: Request, res: Response) => {
  res.send('API is working');
});

// GENERIC crud routes
router.get(
  '/:entity',
  isLoggedIn([ADMIN, LOGGED_USER]),
  crudCtrl.getCrudObjects
);

router.get(
  '/:entity/:idMongoose',
  isLoggedIn([ADMIN, LOGGED_USER]),
  crudCtrl.getSingleCrudObject
);

router.post(
  '/:entity',
  isLoggedIn([ADMIN, LOGGED_USER]),
  crudCtrl.createCrudObject
);

router.post(
  '/:entity/:idMongoose',
  isLoggedIn([ADMIN, LOGGED_USER]),
  crudCtrl.updateCrudObjectById
);

router.delete(
  '/:entity/:idMongoose',
  isLoggedIn([ADMIN, LOGGED_USER]),
  crudCtrl.deleteCrudObjectById
);

export default router;
