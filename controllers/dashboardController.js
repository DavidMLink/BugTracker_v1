import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import Project from '../models/projectModel.js'
import Ticket from '../models/ticketModel.js'
import bcrypt from 'bcryptjs'


// Do NOT have access to req, res, next
const findMyProjects = async (userID) => {
    let projectResults
    // Find User Data in database
    const user = await User.findById(userID)
    // What Projects Assigned To 
    if (Array.isArray(user.projects) || user.projects.length) {
        let allProjects = await Project.find()
        projectResults = allProjects.filter(oneproject => {
            // if (user.projects.includes(oneproject._id)) {
            //     return oneproject;
            // }
            if (oneproject.assignedTo.includes(user._id)) {
                return oneproject;
            } else if (oneproject.owner == user.id) {
                return oneproject;
            }
        })
    } else {
        // projectResults = user.projects
        projectResults = []
        // console.log('You must not have any Assigned Projects...')
    }
    return projectResults
}


// Do NOT have access to req, res, next
const findMyTickets = async (userID) => {
    let ticketResults
    // Find User Data in database
    const user = await User.findById(userID)
    const tickets = await Ticket.find()
    if (tickets) {
        ticketResults = tickets.filter(ticket => {
            if (ticket.assignedTo.includes(user.id)) {
                return ticket;
            } else if (ticket.owner == user.id) {
                return ticket;
            }
        })
    } else {
        // ticketResults = user.projects
        ticketResults = []
        // console.log('You must not have any Assigned Projects...')
    }
    return ticketResults
}


// Do NOT have access to req, res, next
const findMyUsers = async (userID) => {
    let ticketResults
    // Find User Data in database
    const user = await User.findById(userID)
    // const users = await User.find()
    if (user) {
        user.subordinates
        userResults = users.filter(user => {
            if (user.assignedTo.includes(user.id)) {
                return user;
            } else if (user.owner == user.id) {
                return user;
            }
        })
    } else {
        throw new Error('You do not exist!')
        // userResults = []
        // userResults = user.projects
        // console.log('You must not have any Assigned Projects...')
    }
    return userResults
}


// Do NOT have access to req, res, next
// const findMyUsers = async (userID) => {
//     let UserResults
//     // Find User Data in database
//     // const user = await User.findById(userID)

//     let myUsers = await User.find({ assignedTo: user })
//     // What Projects Assigned To 
//     if (myUsers) {
//         UserResults = myUsers
//     } else {
//         UserResults = []
//         // console.log('You must not have any Assigned Users...')
//     }
//     return UserResults
// }





const allProjects = asyncHandler(async (req, res) => {
    // console.log('Dashboard controller!!!');
    // console.log('ALL PROJECTS!!!!!!!!!')
    // Check for user / user.role
    if (!req.user.role) {
        throw new Error('User Does not Have a Role or does not exist!')
    }

    let data;
    let item;

    data = await Project.find();
    item = 'Project'

    if (!data) {
        data = []
    }

    res.render('dashboard', { title: 'Dashboard', item, data })
})

const allTickets = asyncHandler(async (req, res) => {
    // console.log('Dashboard controller!!!');
    // Check for user / user.role
    if (!req.user.role) {
        throw new Error('User Does not Have a Role or does not exist!')
    }

    let data;
    let item;

    data = await Ticket.find();
    item = 'Ticket'

    if (!data) {
        data = []
    }

    res.render('dashboard', { title: 'Dashboard', item, data })
})


const allUsers = asyncHandler(async (req, res) => {
    // console.log('Dashboard controller!!!');
    // Check for user / user.role
    if (!req.user.role) {
        throw new Error('User Does not Have a Role or does not exist!')
    }

    let data;
    let item;

    data = await User.find().populate('projects');
    item = 'User'

    if (!data) {
        data = []
    }

    res.render('dashboard', { title: 'Dashboard', item, data })
})







const myProjects = asyncHandler(async (req, res) => {
    // console.log('Dashboard controller!!!');
    // console.log('MY PROJECTS')
    // Check for user / user.role
    if (!req.user.role) {
        throw new Error('User Does not Have a Role or does not exist!')
    }

    let data;
    let item;

    // data = await Project.findMyProjects(req.user._id)
    data = await findMyProjects(req.user._id)
    item = 'Project'

    if (!data) {
        data = []
    }

    // // console.log(data)

    res.render('dashboard', { title: 'Dashboard', item, data })
})







const myTickets = asyncHandler(async (req, res) => {
    // console.log('Dashboard controller!!!');
    // Check for user / user.role
    if (!req.user.role) {
        throw new Error('User Does not Have a Role or does not exist!')
    }

    let data;
    let item;

    // data = await Ticket.findMyTickets(req.user._id)
    data = await findMyTickets(req.user._id)
    item = 'Ticket'

    if (!data) {
        data = []
    }

    res.render('dashboard', { title: 'Dashboard', item, data })
})


const myUsers = asyncHandler(async (req, res) => {
    // console.log('Dashboard controller!!!');
    // Check for user / user.role
    if (!req.user.role) {
        throw new Error('User Does not Have a Role or does not exist!')
    }

    let data;
    let item;

    data = findMyUsers(req.user._id)
    item = 'User'

    if (!data) {
        data = []
    }

    res.render('dashboard', { title: 'Dashboard', item, data })
})
const subordinateProjects = asyncHandler(async (req, res) => {
    // console.log('Dashboard controller!!!');
    // console.log('MY PROJECTS')
    // Check for user / user.role
    if (!req.user.role) {
        throw new Error('User Does not Have a Role or does not exist!')
    }

    let data;
    let item;

    // data = await Project.findMyProjects(req.user._id)
    data = await findMyProjects(req.user._id)
    item = 'Project'

    if (!data) {
        data = []
    }

    // // console.log(data)

    res.render('dashboard', { title: 'Dashboard', item, data })
})

const subordinateTickets = asyncHandler(async (req, res) => {
    // console.log('Dashboard controller!!!');
    // Check for user / user.role
    if (!req.user.role) {
        throw new Error('User Does not Have a Role or does not exist!')
    }

    let data;
    let item;

    // data = await Ticket.findMyTickets(req.user._id)
    data = await findMyTickets(req.user._id)
    item = 'Ticket'

    if (!data) {
        data = []
    }

    res.render('dashboard', { title: 'Dashboard', item, data })
})


const subordinateUsers = asyncHandler(async (req, res) => {
    // console.log('Dashboard controller!!!');
    // Check for user / user.role
    if (!req.user.role) {
        throw new Error('User Does not Have a Role or does not exist!')
    }

    let data;
    let item;

    // data = await findMyUsers(req.user._id)
    item = 'User'

    const user = await User.findById(req.user._id).populate('subordinates')

    data = user.subordinates

    if (!data) {
        data = []
    }

    res.render('dashboard', { title: 'Dashboard', item, data })
})



const logout = asyncHandler(async (req, res) => {

    // IF TOKEN IS ALREADY "NONE" MAYBE CHECK AND SAY "ALREADY LOGGED OUT / TOKEN ALREADY EXPIRED"

    // console.log("LOGOUT USER!");
    // res.cookie('TOKEN', 'none', {
    //     expires: new Date(Date.now() + 10 * 1000),
    //     httpOnly: true
    // });

    res.clearCookie('TOKEN')

    res.redirect('/')
});


const generateData = asyncHandler(async (req, res) => {
    try {

        // Find Logged In User
        // Get Logged In User
        let userAdmin = await User.findById(req.user.id)
        // Attach User to dummy data

        console.log(userAdmin.id)

        let users = [
            {
                _id: "602e8dd431a3ab15c0dd72b7",
                name: 'Manager 1',
                email: 'manager1@example.com',
                // tickets: [],
                password: bcrypt.hashSync('123456', 10),
                role: 'project manager',
                projects: ['602df56561fbf21cb0eab995', '602e8cc994ed064030fa5633'],
                subordinates: ["602e8dd431a3ab15c0dd72b8", "602e8dd431a3ab15c0dd72b9"],
                supervisors: [userAdmin.id]
            },
            {
                _id: "602e8dd431a3ab15c0dd72b5",
                name: 'Manager 2',
                email: 'manager2@example.com',
                // tickets: [],
                password: bcrypt.hashSync('123456', 10),
                role: 'project manager',
                projects: [],
                subordinates: ["602e8dd431a3ab15c0dd72b8", "602e8dd431a3ab15c0dd72b9"],
                supervisors: [userAdmin.id]
            },
            {
                _id: "602e8dd431a3ab15c0dd72b8",
                name: 'Employee 1',
                email: 'employee1@example.com',
                // tickets: ["602da07e54a3274fe0431d9d", "602da0fa54a3274fe0431d9f", "602da11954a3274fe0431da0"],
                password: bcrypt.hashSync('123456', 10),
                role: 'developer',
                projects: ['602df56561fbf21cb0eab995', '602e8cc994ed064030fa5633'],
                supervisors: [userAdmin.id, "602e8dd431a3ab15c0dd72b7", "602e8dd431a3ab15c0dd72b5"]
            },
            {
                _id: "602e8dd431a3ab15c0dd72b9",
                name: 'Employee 2',
                email: 'employee2@example.com',
                // tickets: ["602da07e54a3274fe0431d9d", "602da0ad54a3274fe0431d9e"],
                password: bcrypt.hashSync('123456', 10),
                role: 'developer',
                projects: ['602df56561fbf21cb0eab995', '602e8cc994ed064030fa5633'],
                supervisors: [userAdmin.id, "602e8dd431a3ab15c0dd72b7", "602e8dd431a3ab15c0dd72b5"]
            },
        ]

        let tickets = [
            {
                "assignedTo": [
                    "602e8dd431a3ab15c0dd72b8", //Jane Deer
                    "602e8dd431a3ab15c0dd72b9" //Steve Smith
                ],
                "project": "602e8cc994ed064030fa5633",
                "status": "New",
                "priority": "Low",
                "type": "Bug",
                "sourcing": "in-sourced",
                "_id": "602da07e54a3274fe0431d9d",
                "title": "Code for plumbing system needs to be reworked",
                "owner": userAdmin.id, //John Doe
                "createdAt": "2021-02-17T23:02:23.000Z",
                "updatedAt": "2021-02-17T23:02:23.000Z",
                "__v": 0
            },
            {
                "assignedTo": [
                    "602e8dd431a3ab15c0dd72b8" //Jane Deer
                ],
                "project": "602e8cc994ed064030fa5633",
                "status": "New",
                "priority": "Low",
                "type": "Bug",
                "sourcing": "in-sourced",
                "_id": "602da0fa54a3274fe0431d9f",
                "title": "Doesn't generate tornados correctly",
                "owner": userAdmin.id, //Jane Deer
                "createdAt": "2021-02-17T23:04:26.330Z",
                "updatedAt": "2021-02-17T23:04:26.330Z",
                "__v": 0
            },
            {
                "assignedTo": [
                    "602e8dd431a3ab15c0dd72b9" //Steve Smith
                ],
                "project": "602df56561fbf21cb0eab995",
                "status": "New",
                "priority": "Low",
                "type": "Bug",
                "sourcing": "in-sourced",
                "_id": "602da0ad54a3274fe0431d9e",
                "title": "Witches cast multiple spells at once. Fix it...",
                "owner": userAdmin.id, //John Doe
                "createdAt": "2021-02-17T23:03:09.937Z",
                "updatedAt": "2021-02-17T23:03:09.937Z",
                "__v": 0
            },
            {
                "assignedTo": [
                    "602e8dd431a3ab15c0dd72b8" //Jane Deer
                ],
                "project": "602df56561fbf21cb0eab995",
                "status": "New",
                "priority": "Low",
                "type": "Bug",
                "sourcing": "in-sourced",
                "_id": "602da11954a3274fe0431da0",
                "title": "Dragons don't fly properly",
                "owner": userAdmin.id, // Admin
                "createdAt": "2021-02-17T23:04:57.446Z",
                "updatedAt": "2021-02-17T23:04:57.446Z",
                "__v": 0
            }
        ]

        let projects = [
            {
                "assignedTo": [
                    "602e8dd431a3ab15c0dd72b7",
                    "602e8dd431a3ab15c0dd72b8",
                    "602e8dd431a3ab15c0dd72b9"
                ],
                "tickets": [
                    "602da11954a3274fe0431da0",
                    "602da0ad54a3274fe0431d9e"
                ],
                "sourcing": "in-sourced",
                "_id": "602df56561fbf21cb0eab995",
                "title": "Skyrim",
                "description": "An open-world DnD like Video Game",
                "owner": userAdmin.id, // John Doe
                "createdAt": "2021-02-18T05:04:37.864Z",
                "updatedAt": "2021-02-18T05:13:59.406Z",
                "__v": 1
            },
            {
                "assignedTo": [
                    "602e8dd431a3ab15c0dd72b7",
                    "602e8dd431a3ab15c0dd72b8",
                    "602e8dd431a3ab15c0dd72b9"
                ],
                "tickets": [
                    "602da07e54a3274fe0431d9d",
                    "602da0fa54a3274fe0431d9f"
                ],
                "sourcing": "in-sourced",
                "_id": "602e8cc994ed064030fa5633",
                "title": "Simcity 2000",
                "description": "Create your own city. Or destroy it...",
                "owner": userAdmin.id, //Admin
                "createdAt": "2021-02-18T15:50:33.268Z",
                "updatedAt": "2021-02-18T15:50:33.268Z",
                "__v": 0
            }
        ]

        const createdUsers = await User.insertMany(users)
        console.log('USERS UPLOADED')
        const createdTickets = await Ticket.insertMany(tickets)
        console.log('TICKETS UPLOADED')
        const createdProjects = await Project.insertMany(projects)
        console.log('PROJECTS UPLOADED')

        let array = ["602e8dd431a3ab15c0dd72b7", "602e8dd431a3ab15c0dd72b8", "602e8dd431a3ab15c0dd72b9", "602e8dd431a3ab15c0dd72b5"]

        array.map(el => {
            userAdmin.subordinates.push(el)
        })

        await userAdmin.save()


        // // console.log(createdUsers);

        // const adminUser = createdUsers[0]._id

        //What does this do?
        // const sampleProducts = products.map((product) => {
        //     return { ...product, user: adminUser }
        // })


        // console.log('Data Imported!'.green.inverse)
        // process.exit()
        res.redirect('/dashboard')
    } catch (error) {
        console.error(`${error}`.red.inverse)
        process.exit(1)
    }
})

const deleteData = asyncHandler(async (req, res) => {
    await User.deleteMany({ _id: { $ne: req.user.id } })
    await Ticket.deleteMany()
    await Project.deleteMany()

    let userAdmin = await User.findById(req.user.id)

    userAdmin.subordinates = []
    await userAdmin.save()

    res.redirect('/dashboard')
})


export {
    logout,
    allProjects,
    allTickets,
    allUsers,
    myProjects,
    myTickets,
    subordinateUsers,
    generateData,
    deleteData
}
