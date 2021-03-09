import express from 'express'
const router = express.Router()

import DeveloperRouter from './developerRoutes.js';
import ManagerRouter from './projectManagerRoutes.js';
import AdminRouter from './adminRoutes.js'
import PseudoAdminRouter from './pseudoAdminRoutes.js'

import { Checks, admin, pseudoAdmin, projectManager } from '../../middleware/authMiddleware.js'

/* 
    SETUP:
        Devised a way to cascade permissions using routing.

    PERMISSIONS:
        ADMIN:
            - Can CREATE|READ|UPDATE|DELETE users, projects, tickets
        PROJECT MANAGER:
            - Can CREATE|READ projects, tickets
            if(Submitter or Assigned manager)
                - Can UPDATE|DELETE projects, tickets
        DEVELOPER:
            - Can CREATE|READ tickets
            if(Submitter)
                - Can UPDATE|DELETE tickets
*/








// IF ADMIN
router.all('*', admin, AdminRouter)

// IF ADMIN, PSEUDO-ADMIN
router.all('*', pseudoAdmin, PseudoAdminRouter)

// IF ADMIN, PSEUDO-ADMIN, PROJECT MANAGER
router.all('*', projectManager, ManagerRouter)

// IF ADMIN, PSEUDO-ADMIN, PROJECT MANAGER, DEVELOPER
router.all('*', DeveloperRouter)

export default router