import express from 'express'
const router = express.Router()
import {
    allProjects,
    allTickets,
    allUsers,
    subordinateUsers,
    myTickets,
    myProjects,
    generateData,
    deleteData
} from '../../controllers/dashboardController.js'
import {
    updateUserPage,
    updateUser,
    deleteUser,
    createUser,
    createUserPage,
    getUserById
} from '../../controllers/userController.js'
import { destroyData } from '../../seeder.js'

// ADMIN ROUTES
// router.get('/', subordinateProjects)
// router.get('/tickets', subordinateTickets)
// router.get('/projects', subordinateProjects)
router.get('/', myProjects)
router.get('/generateData', generateData)
router.get('/deleteData', deleteData)
router.get('/tickets', myTickets)
router.get('/projects', myProjects)
router.get('/users', subordinateUsers)
router.get('/new-user', createUserPage)
router.post('/users', createUser)
router.get('/edit-user/:id', updateUserPage)
router.get('/users/:id', getUserById)
router.put('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)

export default router