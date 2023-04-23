import express, { Request, Response } from 'express';
import { ADMIN, isLoggedIn, LOGGED_USER, SUPER_ADMIN } from '../../middlewares/auth';
import { checkEntity } from '../../middlewares/checkEntity';
import { deleteOrganizationByIdWithPagination, sendOrganizationsSelectionForSuperAdmin } from '../controllers/OrganizationController';
import httpStatus from 'http-status';

const router = express.Router();

/**
 * ORGANIZATION
 */

router.get('/selections/super-admin', isLoggedIn([SUPER_ADMIN]), sendOrganizationsSelectionForSuperAdmin);

router.delete('/with-pagination/:organizationId', isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]), deleteOrganizationByIdWithPagination);
router.delete('/:organizationId', isLoggedIn([ADMIN, LOGGED_USER, SUPER_ADMIN]), deleteOrganizationByIdWithPagination);

router.delete('/with-pagination/linkedChildren/:idMongoose', (req: Request, res: Response) => res.status(httpStatus.FORBIDDEN).send('forbidden'));
export default router;
