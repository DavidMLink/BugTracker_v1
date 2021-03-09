import express from 'express'
const router = express.Router()
import {
    createProject,
    getSpecificProject,
    getAllProjects,
    deleteProject,
    getMyProjects,
    editProject
} from '../../controllers/postman/projectController.js'

import { projectManager, admin, ownerProject } from '../../middleware/authMiddleware.js'

// MUST BE LOGGED IN

router.post('/', createProject)
router.get('/', getMyProjects)

// MUST BE ADMIN
router.get('/all', admin, getAllProjects)
router.get('/:id', admin, getSpecificProject)

// MUST BE owner / ADMIN
router.put('/:id', ownerProject, editProject)
router.delete('/:id', ownerProject, deleteProject)

export default router
