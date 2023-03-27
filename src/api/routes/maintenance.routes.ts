import express from 'express';
import { isLoggedIn } from '../../middlewares/auth';
import { getPublicCrudObjects } from '../controllers/CrudController';
import maintenanceCtrl from '../controllers/MaintenanceController';
const router = express.Router();

router.post('/', isLoggedIn(), maintenanceCtrl.createMaintenance);

router.get('/', isLoggedIn(), maintenanceCtrl.sendThreadToFrondEnd);
router.get('/:maintenanceId', isLoggedIn(), maintenanceCtrl.sendSingleThreadToFrondEnd);
router.delete('/:maintenanceId', isLoggedIn(), maintenanceCtrl.deleteThread);

// todo: available only certain entities
router.get('/', getPublicCrudObjects);

export default router;
