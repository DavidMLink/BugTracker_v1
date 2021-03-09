import express from 'express'
const router = express.Router()
import {
    myTickets,
    logout
} from '../../controllers/dashboardController.js'

import {
    createTicketPage,
    createTicket,
    editTicketPage,
    editTicket,
    deleteTicket,
    getSpecificTicket,
} from '../../controllers/ticketController.js'

import {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
} from '../../controllers/userController.js'


import { Checks } from '../../middleware/authMiddleware.js'


// DEVELOPER ROUTES
router.get('/', myTickets)
router.get('/tickets', myTickets)
router.get('/new-ticket', createTicketPage)
router.get('/new-ticket/:id', createTicketPage)
router.post('/tickets', createTicket)

router.get('/tickets/:id', getSpecificTicket)

// CAN ONLY EDIT/DELETE IF (SUBMITTED | ASSIGNED MANAGER | ADMIN)
router.get('/edit-ticket/:id', Checks, editTicketPage)
router.put('/tickets/:id', Checks, editTicket)
router.delete('/tickets/:id', Checks, deleteTicket)

// PROFILE
router.get('/profile', getUserProfile)
router.put('/profile', updateUserProfile)
router.delete('/profile', deleteUserProfile)
router.get('/logout', logout)

export default router