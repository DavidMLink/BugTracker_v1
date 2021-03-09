import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import Project from './projectModel.js'
import Ticket from './ticketModel.js'

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['developer', 'project manager', 'pseudo-admin', 'admin'],
            default: 'developer'
        },
        projects: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Project',
            }
        ],
        supervisors: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        subordinates: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
        // tickets: [
        //     {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: 'Ticket',
        //     }
        // ]
    },
    {
        timestamps: true,
    }
)

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// Maybe check password has been modified on an update handler instead of on every "save" unless "save" only executes on update?
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.post('update', async function (next) {

    let doc = await this.model.findOne(this.getQuery()); // 'This' is refering to the query instead of the doc. There are several work-arounds. This is one of many work-arounds...
    // console.log('POST UPDATE PROJECT EXECUTED')
    try {
        let users = await User.find({})
        let usersModifed = users.map(async user => {
            // console.log('IN USER MAP')
            if (user.subordinates.includes(doc.id)) {
                // console.log('INCLUDED')
                //IF PROJECT HAS USER ASSIGNED
                if (await doc.supervisors.includes(user.id)) {
                    // console.log('DO NOTHING')
                    // Do Nothing
                }
                //IF PROJECT DOES NOT USER ASSIGNED
                else {
                    for (var i = 0; i <= user.subordinates.length - 1; i++) {
                        // console.log('ARRAY LOOP: ', i)
                        if (user.subordinates[i] == doc.id) {
                            let deletedItems = await user.subordinates.splice(i, 1);
                            // console.log('Deleted Items: ', deletedItems)
                        }
                    }
                }
            }
            // if (!(user.subordinates.includes(doc.id)))
            else {
                // console.log('NOT INCLUDED')
                if (await doc.supervisors.includes(user.id)) {
                    let newLength = await user.subordinates.push(doc._id)
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
        // console.log('BREAK')
        // console.log('BREAK')
        // console.log('BREAK')
        // console.log('BREAK')

        // // console.log("User's Modified: ", usersModifed)

        // next()
    } catch (err) {
        // next(err)
        // console.log(err)
    }
})

// userSchema.post('save', async function (next){

// })

/*
 USER SCHEMA on Update:
    
    assignedTo variable

    
 



*/



userSchema.post('remove', async function (next) {
    try {
        await Project.updateMany(
            //Query
            {
                "assignedTo": {
                    $in: this._id // User's Projects | This Schema
                }
            },
            //Update
            { $pull: { "assignedTo": { $in: this._id } } },
            //Update options (Optional)
            { multi: true }
        )
        await Project.updateMany(
            //Query
            {
                "owner": {
                    $eq: this._id // User's Projects | This Schema
                }
            },
            //Options
            { $unset: { "owner": "" } },
            //Callback
            { multi: true }
        )
        await Ticket.updateMany(
            //Query
            {
                "assignedTo": {
                    $in: this._id // User's Tickets | This Schema
                }
            },
            //Update
            { $pull: { "assignedTo": { $in: this._id } } },
            //Update options (Optional)
            { multi: true }
        )
        await Ticket.updateMany(
            //Query
            {
                "owner": {
                    $eq: this._id // User's Tickets | This Schema
                }
            },
            //Options
            { $unset: { "owner": "" } },
            //Callback
            { multi: true }
        )
        await User.updateMany(
            //Query
            {
                "supervisors": {
                    $in: this._id // User's Users | This Schema
                }
            },
            //Update
            { $pull: { "supervisors": { $in: this._id } } },
            //Update options (Optional)
            { multi: true }
        )
        await User.updateMany(
            //Query
            {
                "subordinates": {
                    $eq: this._id // User's Users | This Schema
                }
            },
            //Options
            { $pull: { "subordinates": { $in: this._id } } },
            //Callback
            { multi: true }
        )
        // await Ticket.deleteMany(
        //     //Query
        //     {
        //         "owner": {
        //             $eq: this._id // User's Tickets | This Schema
        //         }
        //     },
        //Options
        // { $unset: { "owner": "" } },
        //Callback
        // { multi: true }
        // )



        // next()
    } catch (err) {
        // next(err)
        // console.log(err)
    }
})

// userSchema.pre('remove', async function (next) {
//     // this.model('Client').remove({ submission_ids: this._id }, next);
//     // Project.$where('this.username.indexOf("val") !== -1').exec(function (err, docs) { });
//     // Project.find({ owner: this._id, })

//     await Project.remove(this._id, next)
//     next();
// });

const User = mongoose.model('User', userSchema)

export default User