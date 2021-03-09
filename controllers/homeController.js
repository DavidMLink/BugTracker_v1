import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'
import generateCookie from '../utils/generateCookie.js';
// import { protect } from '../middleware/authMiddleware.js';


// GET PAGES

const home = asyncHandler(async (req, res) => {
    res.render('home', { title: 'Express', home: true });
})

const registerPage = asyncHandler(async (req, res) => {
    res.render('register', { title: 'Register' })
})

const loginPage = asyncHandler(async (req, res) => {
    // // console.log(req.redirectedLogin);
    // req.redirectedLogin = req.get('redirectedLogin')
    // // console.log(req.redirectedLogin);
    // console.log(req.session.RedirectLogin);
    if (req.session.RedirectLogin) {
        req.session.RedirectLogin = false;
        // req.session.destroy()
        res.render('login', { title: 'Login', message: 'Must be Logged In!!' })
    } else {
        res.render('login', { title: 'Login', message: 0 })
    }
})

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {

        let Token = generateToken(user._id)
        generateCookie(Token, res)

        res.redirect('/dashboard') //Breaks middleware chain...
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

const logout = asyncHandler(async (req, res) => {

    // IF TOKEN IS ALREADY "NONE" MAYBE CHECK AND SAY "ALREADY LOGGED OUT / TOKEN ALREADY EXPIRED"

    // console.log("LOGOUT USER!");
    res.clearCookie('TOKEN')
    // res.cookie('TOKEN', 'none', {
    //     expires: new Date(Date.now() + 10 * 1000),
    //     httpOnly: true
    // });

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    let role = "pseudo-admin"

    const user = await User.create({
        name,
        email,
        password,
        role
    })

    if (user) {

        let Token = generateToken(user._id)
        generateCookie(Token, res)

        // res.cookie('TOKEN', Token, {
        //     expires: new Date(Date.now() + 8 * 3600000), // Expires in 8 hours
        //     httpOnly: true
        // });

        res.redirect('/dashboard')
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})



export {
    home,
    authUser,
    logout,
    registerUser,
    registerPage,
    loginPage
}
