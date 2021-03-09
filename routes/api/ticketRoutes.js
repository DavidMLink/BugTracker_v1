import express from 'express'
const router = express.Router()

import {
    createTicket,
    getSpecificTicket,
    getAllTickets,
    deleteTicket,
    getMyTickets,
    editTicket
} from '../../controllers/postman/ticketController.js'

import { admin, ownerTicket } from '../../middleware/authMiddleware.js'

// MUST BE LOGGED IN

router.post('/', createTicket)
router.get('/', getMyTickets)

// MUST BE ADMIN
router.get('/all', admin, getAllTickets)
router.get('/:id', admin, getSpecificTicket)

// MUST BE owner / ADMIN
router.put('/:id', ownerTicket, editTicket)
router.delete('/:id', ownerTicket, deleteTicket)

export default router