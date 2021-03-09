import asyncHandler from 'express-async-handler'
import Project from '../models/projectModel.js'
// import { restart } from 'nodemon'
// import generateToken from '../utils/generateToken.js'
import Ticket from '../models/ticketModel.js'
import User from '../models/userModel.js'


const createTicketPage = asyncHandler(async (req, res) => {

    let selected;

    if (req.params.id) {
        selected = req.params.id
    }
    else {
        selected = false
    }

    let item = 'Ticket'
    let users = await User.find()
    let projects = await Project.find()
    // let role = req.user.role
    res.render('createObject', { title: 'Dashboard', users, projects, item, selected })
})

const editTicketPage = asyncHandler(async (req, res) => {
    let users = await User.find()
    let ticket = await Ticket.findById(req.params.id).populate('project')
    let projects = await Project.find()
    let item = 'Ticket'
    res.render('editObject', { title: 'Dashboard', users, ticket, projects, item })
})

// @desc    Create Ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = asyncHandler(async (req, res) => {
    // Find This User who submitted/created ticket
    let { title, project, assignedTo, status, priority, type, sourcing, specificProject } = req.body

    if (!assignedTo) {
        assignedTo = []
    }


    if (status == 'New' && assignedTo.length > 0) {
        status = 'Assigned';
    }

    // let project = await Project.findById(req.params.id)
    let owner = req.user;


    try {
        const user = await User.findById(req.user._id)
    } catch (error) {
        res.status(404)
        throw new Error('User not found... Something went horribly wrong')
    }


    // let emailArray = ["admin@example.com", "john@example.com", "Samantha@example.com"]

    let allUsers = await User.find();


    let results = allUsers.filter(doc => {
        if (assignedTo.includes(doc.id)) {
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
            project,
            assignedTo,
            status,
            priority,
            type,
            sourcing
        })

    // let ticketPop = ticket.populate('assignedTo').populate('owner')

    if (ticket) {
        let updateProject = await Project.findById(project)
        updateProject.tickets.push(ticket)
        updateProject.save();
        if (specificProject) {
            let redirectTo = '/dashboard/projects/' + specificProject
            res.redirect(redirectTo)
        } else {
            res.redirect('/dashboard/tickets')
        }
        // res.status(201).json({
        //     _id: ticketPop._id,
        //     project: project,
        //     title: ticketPop.title,
        //     owner: ticketPop.owner,
        //     assignedTo: ticketPop.assignedTo,
        //     status: ticketPop.status,
        //     priority: ticketPop.priority,
        //     type: ticketPop.type,
        //     sourcing: ticketPop.sourcing,
        // })
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

    let oneTicket = await Ticket.findById(ticketID).populate('assignedTo').populate('owner').populate('project')

    let data = oneTicket
    let item = 'Ticket'

    if (data) {
        res.render('readObject', { title: 'Dashboard', data, item })
        // res.status(201).json({
        //     _id: oneTicket._id,
        //     title: oneTicket.title,
        //     owner: oneTicket.owner,
        //     assignedTo: oneTicket.assignedTo,
        //     status: oneTicket.status,
        //     priority: oneTicket.priority,
        //     type: oneTicket.type,
        //     sourcing: oneTicket.sourcing,
        // })
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
        res.redirect('/dashboard/tickets')
        // res.status(201).json(deleted)
    } else {
        res.status(400)
        throw new Error('Ticket does not exist')
    }
})

// @desc    Edit Ticket
// @route   PUT /api/tickets/:id
// @access  Private
const editTicket = asyncHandler(async (req, res) => {
    let { title, owner, project, status, priority, type, assignedTo, sourcing, specificProject } = req.body


    if (assignedTo) {
        if (!Array.isArray(assignedTo)) {
            assignedTo = assignedTo.split()
        }
    } else {
        assignedTo = []
    }

    if (assignedTo.length > 0) {
        status = 'Assigned';
    } else {
        status = 'New'
    }

    // Get Ticket
    let ticket = await Ticket.findById(req.params.id)
    // Acquire values to be changed from body
    if (ticket) {
        ticket.title = title || ticket.title
        ticket.owner = owner || ticket.owner
        ticket.project = project || ticket.project
        ticket.status = status || ticket.status
        ticket.priority = priority || ticket.priority
        ticket.type = type || ticket.type
        ticket.assignedTo = assignedTo || ticket.assignedTo
        ticket.sourcing = sourcing || ticket.sourcing

        title = title || ticket.title
        owner = owner || ticket.owner
        project = project || ticket.project
        status = status || ticket.status
        priority = priority || ticket.priority
        type = type || ticket.type
        assignedTo = assignedTo || ticket.assignedTo
        sourcing = sourcing || ticket.sourcing


        ticket = await ticket.save()
        // await Ticket.updateOne({ _id: ticket._id })
        // let updateProject = await Project.findById(project)
        // updateProject.tickets.push(ticket)
        // updateProject.save();

        const updatedTicket = await ticket.update({ title, owner, project, status, priority, type, assignedTo, sourcing })

        if (updatedTicket) {

            // console.log('Executed: updatedTicket')
            // let oneProject = await Project.findById(project)



            // oneProject.tickets

            let findTicket = await Ticket.findById(req.params.id).populate('project')
            // let findProject = await Project.findById(ticket.project.id)

            if (findTicket.project.id) {
                let redirectTo = '/dashboard/projects/' + findTicket.project.id
                res.redirect(redirectTo)
            } else {
                res.redirect('/dashboard/tickets')
            }

            // res.status(201).json({
            //     _id: updatedTicket._id,
            //     title: updatedTicket.title,
            //     project: updatedTicket.project,
            //     owner: updatedTicket.owner,
            //     assignedTo: updatedTicket.assignedTo,
            //     status: updatedTicket.status,
            //     priority: updatedTicket.priority,
            //     type: updatedTicket.type,
            //     sourcing: updatedTicket.sourcing,
            // })
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
    deleteTicket,
    editTicket,
    createTicketPage,
    editTicketPage
}