import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import users from './data/users.js'
import tickets from './data/tickets.js'
import projects from './data/projects.js'
import User from './models/userModel.js'
import Ticket from './models/ticketModel.js'
import Project from './models/projectModel.js'
import connectDB from './config/db.js'

dotenv.config()


const importData = async () => {
    try {
        await connectDB()
        await User.deleteMany()
        await Ticket.deleteMany()
        await Project.deleteMany()

        const createdUsers = await User.insertMany(users)
        console.log('USERS UPLOADED')
        const createdTickets = await Ticket.insertMany(tickets)
        console.log('TICKETS UPLOADED')
        const createdProjects = await Project.insertMany(projects)
        console.log('PROJECTS UPLOADED')

        // // console.log(createdUsers);

        // const adminUser = createdUsers[0]._id

        //What does this do?
        // const sampleProducts = products.map((product) => {
        //     return { ...product, user: adminUser }
        // })


        console.log('Data Imported!'.green.inverse)
        process.exit()
    } catch (error) {
        console.error(`${error}`.red.inverse)
        process.exit(1)
    }
}

const destroyData = async () => {

    try {
        await connectDB()
        await User.deleteMany()
        await Ticket.deleteMany()
        await Project.deleteMany()

        console.log('Data Destroyed!'.red.inverse)
        process.exit()
    } catch (error) {
        console.error(`${error}`.red.inverse)
        process.exit(1)
    }
}

if (process.argv[2] === '-d') {
    destroyData()
} else if (process.argv[2] === '-c') {
    importData()
}

export {
    importData,
    destroyData
}