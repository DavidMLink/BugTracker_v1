import asyncHandler from 'express-async-handler'
// import { restart } from 'nodemon'
// import generateToken from '../utils/generateToken.js'
import Ticket from '../../models/ticketModel.js'
import User from '../../models/userModel.js'

// @desc    Create Ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = asyncHandler(async (req, res) => {
    // Find This User who submitted/created ticket
    let { title, status, priority, type, assignedTo, sourcing } = req.body

    if (!Array.isArray(assignedTo)) {
        assignedTo = []
    }

    try {
        const user = await User.findById(req.user._id)
    } catch (error) {
        res.status(404)
        throw new Error('User not found... Something went horribly wrong')
    }

    let owner = req.user;

    // let emailArray = ["admin@example.com", "john@example.com", "Samantha@example.com"]

    let docs = await User.find();


    let results = docs.filter(doc => {
        if (assignedTo.includes(doc.email)) {
            return doc;
        }
        else {
            // do nothing
        }
    })

    assignedTo = results

    const ticket = await Ticket.create(
        {
            title,
            owner,
            assignedTo,
            status,
            priority,
            type,
            sourcing
        })

    let ticketPop = ticket.populate('assignedTo').populate('owner')

    if (ticketPop) {
        res.status(201).json({
            _id: ticketPop._id,
            title: ticketPop.title,
            owner: ticketPop.owner,
            assignedTo: ticketPop.assignedTo,
            status: ticketPop.status,
            priority: ticketPop.priority,
            type: ticketPop.type,
            sourcing: ticketPop.sourcing,
        })
    } else {
        res.status(400)
        throw new Error('Invalid Ticket Data!!')
    }
})


// @desc    Get Specific Ticket
// @route   GET /api/tickets
// @access  Private
const getSpecificTicket = asyncHandler(async (req, res) => {
    let ticketID = req.params.id

    let oneTicket = await Ticket.findById(ticketID)

    if (oneTicket) {
        res.status(201).json({
            _id: oneTicket._id,
            title: oneTicket.title,
            owner: oneTicket.owner,
            assignedTo: oneTicket.assignedTo,
            status: oneTicket.status,
            priority: oneTicket.priority,
            type: oneTicket.type,
            sourcing: oneTicket.sourcing,
        })
    } else {
        res.status(400)
        throw new Error('Ticket does not exist')
    }

})


// @desc    Get All Tickets
// @route   GET /api/tickets/all
// @access  Private
const getAllTickets = asyncHandler(async (req, res) => {

    let allTickets = await Ticket.find()

    if (allTickets) {
        res.status(201).json(allTickets)
    } else {
        res.status(400)
        throw new Error('Ticket does not exist')
    }

})


// @desc    Delete Ticket
// @route   Delete /api/tickets
// @access  Private
const deleteTicket = asyncHandler(async (req, res) => {
    let deleted = await Ticket.findById(req.params.id)

    if (deleted) {
        await deleted.remove()
        res.status(201).json(deleted)
    } else {
        res.status(400)
        throw new Error('Ticket does not exist')
    }
})


// @desc    Get My Tickets
// @route   GET /api/tickets
// @access  Private
const getMyTickets = asyncHandler(async (req, res) => {
    // Get User by ID
    let user = await User.findById(req.user._id)
    // Get Tickets assignedTo to User
    let myTickets = await Ticket.find({ assignedTo: user })
    // Check for Errors such as no tickets have been assignedTo
    if (myTickets) {
        res.status(201).json(myTickets)
    } else {
        res.status(400)
        throw new Error('You haven\'t been assignedTo any tickets.')
    }
})


// @desc    Edit Ticket
// @route   PUT /api/tickets/:id
// @access  Private
const editTicket = asyncHandler(async (req, res) => {
    const { title, status, priority, type, sourcing } = req.body
    // Get Ticket
    let ticket = await Ticket.findById(req.params.id)
    // Acquire values to be changed from body
    if (ticket) {
        ticket.title = title || ticket.title
        ticket.status = status || ticket.status
        ticket.priority = priority || ticket.priority
        ticket.type = type || ticket.type
        ticket.sourcing = sourcing || ticket.sourcing

        const updatedTicket = await ticket.save()

        if (updatedTicket) {
            res.status(201).json({
                _id: updatedTicket._id,
                title: updatedTicket.title,
                owner: updatedTicket.owner,
                assignedTo: updatedTicket.assignedTo,
                status: updatedTicket.status,
                priority: updatedTicket.priority,
                type: updatedTicket.type,
                sourcing: updatedTicket.sourcing,
            })
        } else {
            res.status(404)
            throw new Error('Ticket not updating')
        }

    } else {
        res.status(404)
        throw new Error('Ticket not found')
    }
    // Update values

    // Save values

    // Send values as response

})


export {
    createTicket,
    getSpecificTicket,
    getAllTickets,
    deleteTicket,
    getMyTickets,
    editTicket
}