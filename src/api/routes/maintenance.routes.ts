import express from 'express';
import { isLoggedIn } from '../../middlewares/auth';
import { getPublicCrudObjects } from '../controllers/CrudController';
import maintenanceCtrl from '../controllers/MaintenanceController';
import postController from '../controllers/PostController';
const router = express.Router();

router.post('/', isLoggedIn(), maintenanceCtrl.createMaintenance);

router.get('/:maintenanceId', isLoggedIn(), maintenanceCtrl.sendSingleMaintenanceToFrondEnd);
router.get('/', isLoggedIn(), maintenanceCtrl.sendMaintenancesToFrondEnd);
router.delete('/:maintenanceId', isLoggedIn(), maintenanceCtrl.deleteThread);

// todo: available only certain entities
router.get('/', getPublicCrudObjects);

export default router;
