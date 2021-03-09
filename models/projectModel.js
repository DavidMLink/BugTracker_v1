import mongoose from 'mongoose'
import Ticket from './ticketModel.js'
import User from './userModel.js'

const projectSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        assignedTo: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            }
        ],
        tickets: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Ticket',
            }
        ],
        sourcing: {
            type: String,
            enum: ['in-sourced', 'out-sourced', 'mixed'],
            default: 'in-sourced'
        },
    },
    {
        timestamps: true,
    }
)

// projectSchema.methods.findMyProjects = async function (userID) {
//     let projectResults
//     // Find User Data in database
//     const user = await User.findById(userID)
//     // What Projects Assigned To 
//     if (Array.isArray(user.projects) || user.projects.length) {
//         let allProjects = await Project.find()
//         projectResults = allProjects.filter(oneproject => {
//             // if (user.projects.includes(oneproject._id)) {
//             //     return oneproject;
//             // }
//             if (oneproject.assignedTo.includes(user._id)) {
//                 return oneproject;
//             } else if (oneproject.owner == user.id) {
//                 return oneproject;
//             }
//         })
//     } else {
//         // projectResults = user.projects
//         projectResults = []
//         // console.log('You must not have any Assigned Projects...')
//     }
//     return projectResults
// }


/*
 PROJECT SCHEMA on Update:
    
    assignedTo variable

    // IF change in assignedTo
    if (Project/this.assignedTo == assignedTo){

    }

    project.assignedTo // THIS IS OVERWRITTEN VARIABLE
    project.id

    // GET ALL USERS
    await User.find({})
    // GET ALL PROJECTS
    await Project.find({})

    if()


*/

// projectSchema.post('updateOne', { document: true, query: false }, async function (next) {
projectSchema.post('update', async function (next) {

    let doc = await this.model.findOne(this.getQuery()); // 'This' is refering to the query instead of the doc. There are several work-arounds. This is one of many work-arounds...
    // console.log('POST UPDATE PROJECT EXECUTED')
    try {
        let users = await User.find({})
        let usersModifed = users.map(async user => {
            // console.log('IN USER MAP')
            if (user.projects.includes(doc.id)) {
                // console.log('INCLUDED')
                //IF PROJECT HAS USER ASSIGNED
                if (await doc.assignedTo.includes(user.id)) {
                    // console.log('DO NOTHING')
                    // Do Nothing
                }
                //IF PROJECT DOES NOT USER ASSIGNED
                else {
                    for (var i = 0; i <= user.projects.length - 1; i++) {
                        // console.log('ARRAY LOOP: ', i)
                        if (user.projects[i] == doc.id) {
                            let deletedItems = await user.projects.splice(i, 1);
                            // console.log('Deleted Items: ', deletedItems)
                        }
                    }
                }
            }
            // if (!(user.projects.includes(doc.id)))
            else {
                // console.log('NOT INCLUDED')
                if (await doc.assignedTo.includes(user.id)) {
                    let newLength = await user.projects.push(doc._id)
                    // console.log('Length: ', newLength)
                    await user.save()
                }
                else {
                    // console.log('DO NOTHING')
                    // Do Nothing
                }
            }
            let newUser = await user.save()
            // console.log('New User: ', newUser)
        })
        // next()
    } catch (err) {
        // next(err)
        // console.log(err)
    }
    // IF UPDATED PROJECT, UPDATE USERS ASSIGNED TO TICKETS
    // IF UPDATED PROJECT, UPDATE USERS ASSIGNED TO TICKETS
    // IF UPDATED PROJECT, UPDATE USERS ASSIGNED TO TICKETS
    // try {
    //     let tickets = await Ticket.find({})
    //     let ticketsModified = tickets.map(async ticket => {
    //         // console.log('IN ticket MAP')
    //         if (ticket.assignedTo.includes(doc.id)) {
    //             // console.log('INCLUDED')
    //             //IF ticket HAS ticket ASSIGNED
    //             if (await ticket.assignedTo.includes(user.id)) {
    //                 // console.log('DO NOTHING')
    //                 // Do Nothing
    //             }
    //             //IF ticket DOES NOT ticket ASSIGNED
    //             else {
    //                 for (var i = 0; i <= ticket.tickets.length - 1; i++) {
    //                     // console.log('ARRAY LOOP: ', i)
    //                     if (ticket.tickets[i] == doc.id) {
    //                         let deletedItems = await ticket.tickets.splice(i, 1);
    //                         // console.log('Deleted Items: ', deletedItems)
    //                     }
    //                 }
    //             }
    //         }
    //         // if (!(ticket.tickets.includes(doc.id)))
    //         else {
    //             // console.log('NOT INCLUDED')
    //             if (await doc.ticket == ticket._id) {
    //                 let newLength = await ticket.tickets.push(doc._id)
    //                 // console.log('Length: ', newLength)
    //                 await ticket.save()
    //             }
    //             else {
    //                 // console.log('DO NOTHING')
    //                 // Do Nothing
    //             }
    //         }
    //         let newticket = await ticket.save()
    //         // console.log('New project: ', newUser)
    //     })

    // } catch (error) {

    // }
})

projectSchema.post('remove', async function (next) {

    // // console.log(this._id)
    // // console.log(this._id)
    // // console.log(this._id)
    // // console.log(this._id)
    // // console.log(this._id)

    try {
        await User.updateMany(
            //Query
            {
                "projects": {
                    $in: this._id // User's Users | This Schema
                }
            },
            //Update
            { $pull: { "projects": { $in: this._id } } },
            //Update options (Optional)
            { multi: true }
        )
        // await Ticket.updateMany(
        //     //Query
        //     {
        //         "assignedTo": {
        //             $in: this._id // User's Tickets | This Schema
        //         }
        //     },
        //     //Update
        //     { $pull: { "assignedTo": { $in: this._id } } },
        //     //Update options (Optional)
        //     { multi: true }
        // )
        await Ticket.deleteMany(
            //Query
            {
                "project": {
                    $eq: this._id // User's Tickets | This Schema
                }
            },
            // Options
            // { $unset: { "project": "" } },
            // Callback
            // { multi: true }
        )



        // next()
    } catch (err) {
        // next(err)
        // console.log(err)
    }
})

const Project = mongoose.model('Project', projectSchema)

export default Project