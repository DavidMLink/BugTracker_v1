import express from 'express'
const router = express.Router()
import {
    allProjects,
    allTickets,
    allUsers
} from '../../controllers/dashboardController.js'
import {
    updateUserPage,
    updateUser,
    deleteUser,
    createUser,
    createUserPage,
    getUserById
} from '../../controllers/userController.js'

// ADMIN ROUTES
router.get('/', allProjects)
router.get('/tickets', allTickets)
router.get('/projects', allProjects)
router.get('/users', allUsers)
// router.get('/new-user', createUserPage)
// router.post('/users', createUser)
// router.get('/edit-user/:id', updateUserPage)
// router.get('/users/:id', getUserById)
// router.put('/users/:id', updateUser)
// router.delete('/users/:id', deleteUser)

export default router