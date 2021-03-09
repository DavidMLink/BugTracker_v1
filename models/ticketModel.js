import mongoose from 'mongoose'
import User from './userModel.js';

const ticketSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Project',
        },
        assignedTo: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            }
        ],
        status: {
            type: String,
            enum: ['New', 'Assigned', 'In Progress', 'Resolved', 'On-Hold'],
            default: 'New'
        },
        priority: {
            type: String,
            enum: ['None', 'Low', 'Medium', 'High'],
            default: 'None'
        },
        type: {
            type: String,
            enum: ['Bug', 'Feature Request'],
            default: 'Bug'
        },
        sourcing: {
            type: String,
            enum: ['in-sourced', 'out-sourced'],
            default: 'in-sourced'
        },
    },
    {
        timestamps: true,
    }
)


// ticketSchema.methods.findMyTickets = async (userID) => {
//     let ticketResults
//     // Find User Data in database
//     const user = await User.findById(userID)
//     const tickets = await Ticket.find()
//     if (tickets) {
//         ticketResults = tickets.filter(ticket => {
//             if (ticket.assignedTo.includes(user.id)) {
//                 return ticket;
//             } else if (ticket.owner == user.id) {
//                 return ticket;
//             }
//         })
//     } else {
//         // ticketResults = user.projects
//         ticketResults = []
//         // console.log('You must not have any Assigned Projects...')
//     }
//     return ticketResults
// }

ticketSchema.post('updateOne', async function (next) {
    let doc = await this.model.findOne(this.getQuery());

    // console.log('POST UPDATE TICKET EXECUTED')

    try {
        let projects = await Project.find({})
        let projectsModified = projects.map(async project => {
            // console.log('IN PROJECT MAP')
            if (project.tickets.includes(doc.id)) {
                // console.log('INCLUDED')
                //IF ticket HAS project ASSIGNED
                if (await doc.project == project._id) {
                    // console.log('DO NOTHING')
                    // Do Nothing
                }
                //IF ticket DOES NOT project ASSIGNED
                else {
                    for (var i = 0; i <= project.tickets.length - 1; i++) {
                        // console.log('ARRAY LOOP: ', i)
                        if (project.tickets[i] == doc.id) {
                            let deletedItems = await project.tickets.splice(i, 1);
                            // console.log('Deleted Items: ', deletedItems)
                        }
                    }
                }
            }
            // if (!(project.tickets.includes(doc.id)))
            else {
                // console.log('NOT INCLUDED')
                if (await doc.project == project._id) {
                    let newLength = await project.tickets.push(doc._id)
                    // console.log('Length: ', newLength)
                    await project.save()
                }
                else {
                    // console.log('DO NOTHING')
                    // Do Nothing
                }
            }
            let newproject = await project.save()
            // console.log('New project: ', newUser)
        })

    } catch (error) {

    }
})


ticketSchema.post('remove', async function (next) {
    try {
        await Project.updateMany(
            //Query
            {
                "tickets": {
                    $in: this._id // User's Users | This Schema
                }
            },
            //Update
            { $pull: { "tickets": { $in: this._id } } },
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
        // await Ticket.deleteMany(
        //     //Query
        //     {
        //         "project": {
        //             $eq: this._id // User's Tickets | This Schema
        //         }
        //     },
        //     // Options
        //     // { $unset: { "project": "" } },
        //     // Callback
        //     // { multi: true }
        // )

    } catch (err) {
        // next(err)
        // console.log(err)
    }
})

const Ticket = mongoose.model('Ticket', ticketSchema)

export default Ticket