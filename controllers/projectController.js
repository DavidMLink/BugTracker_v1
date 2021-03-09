import asyncHandler from 'express-async-handler'
import Project from '../models/projectModel.js'
import User from '../models/userModel.js'
import Ticket from '../models/ticketModel.js'


const createProjectPage = asyncHandler(async (req, res) => {
    let item = 'Project'
    let users = await User.find()
    // let signedInUser.id = await User.findById(req.user.id);
    res.render('createObject', { title: 'Dashboard', users, item })
})

const editProjectPage = asyncHandler(async (req, res) => {
    let users = await User.find()
    let project = await Project.findById(req.params.id)
    let item = 'Project'
    res.render('editObject', { title: 'Dashboard', users, project, item })
})

// @desc    
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
    // Find this User who submitted/created Project
    let { title, description, assignedTo, sourcing } = req.body


    if (assignedTo) {
        if (!Array.isArray(assignedTo)) {
            assignedTo = assignedTo.split()
        }
    } else {
        assignedTo = []
    }

    let owner = req.user

    // if (req.user.role == 'pseudo-admin') {
    //     let userAdmin = await User.findById(req.user.id)
    //     assignedTo.push(userAdmin.id)
    // }

    let users = await User.find()
    let projectUsers = users.filter(user => {
        if (assignedTo.includes(user.id)) {
            return user;
        }
        else {
            // do nothing
        }
    })

    const project = await Project.create(
        {
            title,
            description,
            owner,
            assignedTo: projectUsers,
            sourcing
        }
    )

    let allUsers = await User.find();
    let specificUsers = allUsers.filter(user => {
        if (assignedTo.includes(user.id)) {
            return user;
        }
        else {
            // Do nothing
        }
    })

    let userDocuments = specificUsers.map(async user => {
        await user.projects.push(project.id)
        await user.save()
    })


    let projectPop = project.populate('assignedTo').populate('owner').populate('tickets')

    if (projectPop) {
        res.redirect('/dashboard')
    } else {
        res.status(400)
        throw new Error('Invalid Project Data!!')
    }

})








// @desc    Get Specific Project
// @route   GET /api/projects
// @access  Private
const getSpecificProject = asyncHandler(async (req, res) => {
    // VIEW PROJECT'S TICKETS
    let projectID = req.params.id

    let oneProject = await Project.findById(projectID).populate('tickets')

    let projectPop = oneProject

    // // console.log(projectPop)

    let data = projectPop.tickets
    let item;

    // let header = (oneProject.title, '\'s')
    // res.locals.headerTitle = oneProject.title
    // res.locals.oneItem = oneProject.title + '\'s'
    res.locals.oneItem = oneProject

    // data = findMyTickets(req.user._id)
    item = 'Ticket'

    if (!data) {
        data = []
    }


    if (data) {

        res.render('dashboard', { title: 'Dashboard', item, data })
        // res.status(201).json({
        //     _id: oneProject._id,
        //     title: oneProject.title,
        //     description: oneProject.description,
        //     owner: oneProject.owner,
        //     assignedTo: oneProject.assignedTo,
        //     tickets: oneProject.projects,
        //     sourcing: oneProject.sourcing,
        // })
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
        res.redirect('/dashboard')
        // res.status(201).json(deleted)
    } else {
        res.status(400)
        throw new Error('Project does not exist')
    }
})

// @desc    Edit Project
// @route   PUT /api/projects/:id
// @access  Private
const editProject = asyncHandler(async (req, res) => {
    let { title, description, owner, assignedTo, sourcing, uncheckedVals } = req.body


    uncheckedVals = uncheckedVals.toString()
    // // console.log(uncheckedVals)
    uncheckedVals = uncheckedVals.split(',')
    // // console.log(uncheckedVals)



    let project = await Project.findById(req.params.id)

    let users = await User.find()

    // let userResults;

    if (assignedTo) {
        if (!Array.isArray(assignedTo)) {
            assignedTo = assignedTo.split()
        }
    } else {
        assignedTo = []
    }

    // if (req.user.role == 'pseudo-admin' || true) {
    //     let SignedIn = await User.findById(req.user.id)
    //     assignedTo.push(SignedIn.id)
    // }

    // Acquire values to be changed from body
    if (project) {
        project.title = title || project.title
        project.owner = owner || project.owner
        project.description = description || project.description
        project.assignedTo = assignedTo
        project.sourcing = sourcing || project.sourcing

        title = title || project.title
        owner = owner || project.owner
        description = description || project.description
        assignedTo = assignedTo
        sourcing = sourcing || project.sourcing


        await project.save()

        const updatedProject = await project.update({ title, owner, description, assignedTo, sourcing })

        let oneProject = await Project.findById(req.params.id).populate('tickets')
        let someTickets = oneProject.tickets
        // const allTickets = await Ticket.find({})
        let ticketResults = someTickets.map(async ticket => {

            for (let j = 0; j < ticket.assignedTo.length; j++) {
                for (var i = 0; i < uncheckedVals.length; i++) {
                    // console.log('ARRAY LOOP: ', i)
                    if (ticket.assignedTo[j] == uncheckedVals[i]) {
                        let deletedItems = await ticket.assignedTo.splice(j, 1);
                        // console.log('Deleted Items: ', deletedItems)
                    }
                }
            }
            await ticket.save()
        })
        // const updatedProject = await Project.updateOne({ _id: project._id }, { title, owner, description, assignedTo, sourcing })
        // console.log('ABOUT TO PERFORM UPDATE')
        // let updatedProject = await Project.updateOne({ _id: project._id })


        if (updatedProject) {

            // console.log('Executed: updatedProject')
            // await updateUserDocs();

            // // console.log(userDocuments)

            // user.projects.includes(NonArray)
        }

        else {
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
    res.redirect('/dashboard')

})


export {
    createProjectPage,
    createProject,
    getSpecificProject,
    deleteProject,
    editProject,
    editProjectPage
}