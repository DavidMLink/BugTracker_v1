import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import generateCookie from '../utils/generateCookie.js';
import User from '../models/userModel.js'


const updateUserPage = asyncHandler(async (req, res) => {
    let selectedUser = await User.findById(req.params.id)
    let item = 'User'

    let users = await User.find()

    res.render('editObject', {
        title: 'Dashboard',
        selectedUser,
        item,
        users
    })
})

const createUserPage = asyncHandler(async (req, res) => {
    let users = await User.find()
    let item = 'User'
    res.render('createObject', {
        title: 'Dashboard',
        item,
        users
    })
})

const createUser = asyncHandler(async (req, res) => {
    let {
        name,
        email,
        password,
        role,
        manager_id
    } = req.body

    if (!manager_id) {
        manager_id = []
    }

    if (!Array.isArray(manager_id)) {
        manager_id = manager_id.split()
    }

    const userExists = await User.findOne({
        email
    })

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    if (req.user.role == 'pseudo-admin') {
        let userAdmin = await User.findById(req.user.id)
        manager_id.push(userAdmin.id)
    }

    if (manager_id) {
        var user = await User.create({
            name,
            email,
            password,
            role,
            supervisors: manager_id
        })
    } else {
        var user = await User.create({
            name,
            email,
            password,
            role
        })
    }


    if (user) {
        if (req.user.role == 'pseudo-admin') {
            let userAdmin = await User.findById(req.user.id)
            userAdmin.subordinates.push(user)
            userAdmin.save()
        }
        // if (manager_id) {
        //     let Manager = await User.findById(manager_id)
        //     Manager.subordinates.push(user)
        //     Manager.save()
        // }


        res.redirect('/dashboard/users')

    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const data = await User.findById(req.user._id)
    let item = 'Profile'

    if (data) {
        res.render('editObject', {
            title: 'Dashboard',
            data,
            item
        })
        // res.json({
        //     _id: user._id,
        //     name: user.name,
        //     email: user.email,
        //     role: user.role,
        // })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)

    // // console.log('req.body: ', req.body)

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) {
            user.password = req.body.password
        }

        // // console.log(user.name)
        // // console.log(user.email)

        const updatedUser = await user.save()

        let Token = generateToken(updatedUser._id)

        generateCookie(Token, res)

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: Token,
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})


// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    // Campground.findById(req.params.id, function (err, campground) {
    //     if (err) {
    //         return next(err)
    //     }
    //     campground.remove();
    // })

    if (user) {
        await user.remove()
        res.redirect('/dashboard/users')
        // res.json({ message: 'User removed' })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

const deleteUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate('projects');
    // const projects = await Project.find();

    // user.projects.forEach(element => {

    // });

    if (user) {
        await user.remove()
        res.clearCookie('TOKEN')
        res.redirect('/')
        // res.json({ message: 'User removed' })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')


    if (user) {
        let data = user;
        let item = 'User'
        res.render('readObject', {
            title: 'Dashboard',
            data,
            item
        })
        // res.json(user)
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    let { name, email, role, manager_id } = req.body

    if (!manager_id) {
        manager_id = []
    }

    if (!Array.isArray(manager_id)) {
        manager_id = manager_id.split()
    }


    if (req.user.role == 'pseudo-admin') {
        let userAdmin = await User.findById(req.user.id)
        manager_id.push(userAdmin.id)
    }

    if (user) {
        user.name = name || user.name
        user.email = email || user.email
        user.role = role || user.role
        user.supervisors = manager_id || user.supervisors

        const savedUser = await user.save()


        if (savedUser) {
            await savedUser.update({ name, email, role, manager_id })
            if (req.body.manager_id) {
                // let Manager = await User.findById(req.body.manager_id)
                // Manager.employees.push(user)
                // Manager.save()

                // let users = await User.find({})
                // let project_managers = users.map(user => {
                //     if (user.employees) {
                //         if (user.employees.includes(updatedUser.id) {
                //             return user;
                //         }
                //     }
                // })
            }
            res.redirect('/dashboard/users')
        } else {
            res.status(404)
            throw new Error('Could not save User')
        }
        // res.json({
        //     _id: updatedUser._id,
        //     name: updatedUser.name,
        //     email: updatedUser.email,
        //     role: updatedUser.role,
        // })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

export {
    getUserProfile,
    updateUserProfile,
    deleteUser,
    deleteUserProfile,
    getUserById,
    updateUser,
    updateUserPage,
    createUser,
    createUserPage,
}