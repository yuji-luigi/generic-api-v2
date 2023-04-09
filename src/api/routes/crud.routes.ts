import { SUPER_ADMIN } from './../../middlewares/auth';
import express, { Request, Response } from 'express';

const router = express.Router();
import crudCtrl from '../controllers/CrudController';
import { isLoggedIn, ADMIN, LOGGED_USER } from '../../middlewares/auth';
import { checkEntity } from '../../middlewares/checkEntity';

router.get('/', (req: Request, res: Response) => {
  res.send('API is working');
});

// GENERIC crud routes
router.get('/:entity', checkEntity, isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]), crudCtrl.getCrudObjectsWithPagination);

router.get('/:entity/:idMongoose', checkEntity, isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]), crudCtrl.getSingleCrudObject);

router.get('/options/:entity/:idMongoose', checkEntity, isLoggedIn(), crudCtrl.getSingleCrudObject);

router.post('/:entity', checkEntity, isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]), crudCtrl.createCrudObject);

router.put('/:entity/:idMongoose', checkEntity, isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]), crudCtrl.updateCrudObjectById);

router.delete('/:entity/:idMongoose', checkEntity, isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]), crudCtrl.deleteCrudObjectById);

export default router;
