import express from 'express'
const router = express.Router()
import {
    myProjects,
} from '../../controllers/dashboardController.js'

import {
    createProjectPage,
    createProject,
    editProjectPage,
    editProject,
    deleteProject,
    getSpecificProject
} from '../../controllers/projectController.js'

import { Checks } from '../../middleware/authMiddleware.js'

// AFTER CHECKING THE USER'S ROLE
// CAN ONLY EDIT/DELETE IF (SUBMITTED | ASSIGNED MANAGER | ADMIN)


router.get('/', myProjects)
router.get('/projects', myProjects)

// PROJECTS
router.post('/projects', createProject)
router.get('/new-project', createProjectPage)


// PROJECT SPECIFIC
router.get('/projects/:id', getSpecificProject)
router.put('/projects/:id', Checks, editProject)
router.delete('/projects/:id', Checks, deleteProject)
router.get('/edit-project/:id', Checks, editProjectPage)

export default router