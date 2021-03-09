import asyncHandler from 'express-async-handler'
import Project from '../../models/projectModel.js'
import User from '../../models/userModel.js'
import Ticket from '../../models/ticketModel.js'

// @desc    
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
    // Find this User who submitted/created Project
    let { title, description, assignedTo, ticketIDs, sourcing } = req.body

    if (!Array.isArray(ticketIDs)) {
        ticketIDs = []
    }

    if (!Array.isArray(assignedTo)) {
        assignedTo = []
    }

    let owner = req.user


    // DELETE THIS EVENTUALLY
    ticketIDs = ["602da07e54a3274fe0431d9d", "602da0ad54a3274fe0431d9e"]

    let users = await User.find()
    let userResults = users.filter(user => {
        if (assignedTo.includes(user.email)) {
            return user;
        }
        else {
            // do nothing
        }
    })
    let allTickets = await Ticket.find()
    let ticketResults = allTickets.filter(oneticket => {
        if (ticketIDs.includes(oneticket._id)) {
            return oneticket;
        }
        else {
            // do nothing
        }
    })

    assignedTo = userResults
    let tickets = ticketResults

    const project = await Project.create(
        {
            title,
            description,
            owner,
            assignedTo,
            tickets,
            sourcing
        }
    )

    let projectPop = project.populate('assignedTo').populate('owner').populate('projects')

    if (projectPop) {
        res.status(201).json({
            _id: projectPop._id,
            title: projectPop.title,
            description: projectPop.description,
            owner: projectPop.owner,
            assignedTo: projectPop.assignedTo,
            tickets: projectPop.projects,
            sourcing: projectPop.sourcing,
        })
    } else {
        res.status(400)
        throw new Error('Invalid Project Data!!')
    }

})








// @desc    Get Specific Project
// @route   GET /api/projects
// @access  Private
const getSpecificProject = asyncHandler(async (req, res) => {
    let projectID = req.params.id

    let oneProject = await Project.findById(projectID)

    if (oneProject) {
        res.status(201).json({
            _id: oneProject._id,
            title: oneProject.title,
            description: oneProject.description,
            owner: oneProject.owner,
            assignedTo: oneProject.assignedTo,
            tickets: oneProject.projects,
            sourcing: oneProject.sourcing,
        })
    } else {
        res.status(400)
        throw new Error('Project does not exist')
    }

})


// @desc    Get All Projects
// @route   GET /api/projects/all
// @access  Private
const getAllProjects = asyncHandler(async (req, res) => {

    let allProjects = await Project.find()

    if (allProjects) {
        res.status(201).json(allProjects)
    } else {
        res.status(400)
        throw new Error('Project does not exist')
    }

})


// @desc    Delete Project
// @route   Delete /api/projects
// @access  Private
const deleteProject = asyncHandler(async (req, res) => {
    let deleted = await Project.findById(req.params.id)

    if (deleted) {
        await deleted.remove()
        res.status(201).json(deleted)
    } else {
        res.status(400)
        throw new Error('Project does not exist')
    }
})


// @desc    Get My Projects
// @route   GET /api/projects
// @access  Private
const getMyProjects = asyncHandler(async (req, res) => {
    // Get User by ID
    let user = await User.findById(req.user._id)
    // Get Projects assigned to User
    let myProjects = await Project.find({ assignedTo: user })
    // Check for Errors such as no projects have been assigned
    if (myProjects) {
        res.status(201).json(myProjects)
    } else {
        res.status(400)
        throw new Error('You haven\'t been assigned any projects.')
    }
})


// @desc    Edit Project
// @route   PUT /api/projects/:id
// @access  Private
const editProject = asyncHandler(async (req, res) => {
    let { title, description, assignedTo, ticketIDs, sourcing } = req.body
    // Get Project
    let project = await Project.findById(req.params.id)

    let users = await User.find()

    let userResults = users.filter(user => {
        if (assignedTo.includes(user.email)) {
            return user;
        }
        else {
            // do nothing
        }
    })

    // // console.log(ticketIDs);

    let allTickets = await Ticket.find()
    let ticketResults = allTickets.filter(oneticket => {
        if (ticketIDs.includes(oneticket.id)) {
            return oneticket;
        }
        else {
            // // console.log('nothing');
        }
    })

    // // console.log(ticketResults);

    // Acquire values to be changed from body
    if (project) {
        project.title = title || project.title
        project.description = description || project.description
        project.owner = project.owner
        project.assignedTo = userResults || project.assignedTo
        project.tickets = ticketResults || project.tickets
        project.sourcing = sourcing || project.sourcing


        const updatedProject = await project.save()

        if (updatedProject) {
            res.status(201).json({
                _id: updatedProject._id,
                title: updatedProject.title,
                description: updatedProject.description,
                owner: updatedProject.owner,
                assignedTo: updatedProject.assignedTo,
                tickets: updatedProject.tickets,
                sourcing: updatedProject.sourcing,
            })
        } else {
            res.status(404)
            throw new Error('Project not updating')
        }

    } else {
        res.status(404)
        throw new Error('Project not found')
    }
    // Update values

    // Save values

    // Send values as response

})


export {
    createProject,
    getSpecificProject,
    getAllProjects,
    deleteProject,
    getMyProjects,
    editProject
}