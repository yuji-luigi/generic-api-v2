import express from 'express';

const router = express.Router();

import crudRoutes from './crud.routes';
import authRoutes from './auth.routes';
import customRoutes from './crud.custom.routes';
import uploadFilesRoutes from './uploadFiles.routes';
import threadRoutes from './thread.routes';
//= ===============================================================================
// AUTH ROUTES
//= ===============================================================================
router.use('/auth', authRoutes);
router.use('/upload-files', uploadFilesRoutes);
//= ===============================================================================
// CUSTOM ROUTES
//= ===============================================================================
router.use('/threads', threadRoutes);
router.use('/', customRoutes);

//= ===============================================================================
// CRUD ROUTES
//= ===============================================================================
router.use('/', crudRoutes);

export default router;
