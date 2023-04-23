import express from 'express';

const router = express.Router();

import crudRoutes from './crud.routes';
import authRoutes from './auth.routes';
import customRoutes from './crud.custom.routes';
import uploadFilesRoutes from './uploadFiles.routes';
import threadRoutes from './thread.routes';
import spaceRoutes from './space.routes';
import organizationRoutes from './organization.routes';
// import dataTableRoutes from './data-table.routes';
import maintenanceRoutes from './maintenance.routes';
//= ===============================================================================
// AUTH ROUTES
//= ===============================================================================
router.use('/auth', authRoutes);
router.use('/upload-files', uploadFilesRoutes);
//= ===============================================================================
// CUSTOM ROUTES
//= ===============================================================================
router.use('/maintenances', maintenanceRoutes);
router.use('/threads', threadRoutes);
router.use('/spaces', spaceRoutes);
router.use('/organizations', organizationRoutes);
// router.use('/with-pagination', dataTableRoutes);

router.use('/', customRoutes);

//= ===============================================================================
// CRUD ROUTES
//= ===============================================================================
router.use('/', crudRoutes);

export default router;
