import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Ticket from '../models/ticketModel.js';
import Project from '../models/projectModel.js';

// const alreadyLoggedIn = asyncHandler(async (req, res, next) => {
//   let token;
//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

//     token = req.headers.authorization.split(' ')[1]

//     const decoded = jwt.verify(token, process.env.JWT_SECRET)

//     req.user = await User.findById(decoded.id).select('-password')

//     if (req.user) {
//       throw new Error('User is already Logged in!');
//     }
//   }
//   next()
// })



// Have One Protected Function
// Check for requested URL
// if (loggedIn && url == /home){
// redirect('/dashboard')
// }
// if(loggedIn && url == '/dashboard/ANYTHING'){
// 
// }  else{
// redirect('/home/login') 
// }

const protect = asyncHandler(async (req, res, next) => {
  let token

  // console.log('PROTECTED EXECUTED');

  // console.log(req.path)
  // // console.log(req.path)
  // // console.log(req.path)

  let regex = '\/dashboard.*';
  // if (req.path.search(regex) != -1) {

  // }



  if (req.cookies.TOKEN) {

    try {
      // Authenticate the Token
      const decoded = jwt.verify(req.cookies.TOKEN, process.env.JWT_SECRET)

      // Make sure User exists
      req.user = await User.findById(decoded.id).select('-password')
      // console.log('Found User!');

      // IF LOGGED-IN THEN REDIRECT TO DASHBOARD 
      if (req.path.search(regex) == -1) {
        return res.redirect('/dashboard')
      }
      return next()

    } catch (error) {
      if (req.path.search(regex) != -1) {
        // console.log('Redirecting to Login!')
        req.session.RedirectLogin = true;
        res.redirect('/')
      }
      // throw new Error('Your token doesn\'t exist or is malformed... probably')
    }
  }

  if (!token) {
    if (req.path.search(regex) != -1) {
      // console.log('Redirecting to Login!')
      req.session.RedirectLogin = true;
      res.redirect('/')
    }
    // // console.log('No Token!');
    // // console.log('Redirecting to Login!')
    // req.session.RedirectLogin = true;
    // res.redirect('/login')
  }

  // console.log('BaseURL:', req.baseUrl)

  // if (req.path == '/dashboard') {
  // }

  // Not Logged In
  // AND
  // Not accessing any private / loggedIn paths
  next()
  // console.log('PROTECTED END');
})

const Checks = asyncHandler(async (req, res, next) => {

  // AFTER CHECKING THE USER'S ROLE

  // CAN ONLY EDIT/DELETE IF (SUBMITTED | ASSIGNED MANAGER | ADMIN)

  if (req.user) {
    // console.log(req.user.role)
  } else {
    throw new Error('User is not signed in or does not exist')
  }

  // CHECK IF ADMIN
  if (req.user.role == 'admin') {
    return next();
  }

  let project = await Project.findById(req.params.id)
  let ticket = await Ticket.findById(req.params.id)


  // || (req.user.role == 'admin'))

  if (project) {
    // CHECK IF SUBMITTED PROJECT
    if (project.owner) {
      if (project.owner.equals(req.user._id)) {
        return next()
      }
    }
    // CHECK IF PROJECT MANAGER (PM)
    if (req.user.role == 'project manager') {
      // CHECK IF PM^ IS ASSIGNED TO PROJECT
      if (project.assignedTo.includes(req.user._id)) {
        return next()
      }
    }
  } else if (ticket) {
    if (ticket.owner) {
      // CHECK IF SUBMITTED TICKET
      if (ticket.owner.equals(req.user._id)) {
        return next()
      }
    }
    // CHECK IF PROJECT MANAGER (PM)
    if (req.user.role == 'project manager') {
      // CHECK IF PM^ IS ASSIGNED TO TICKET
      if (ticket.assignedTo.includes(req.user._id)) {
        return next()
      }
    }
  }
  else {
    throw new Error('Specific Project or Ticket (params.id) does not exist')
  }



})





const projectManager = (req, res, next) => {
  if (req.user && ((req.user.role == 'project manager') || (req.user.role == 'admin') || (req.user.role == 'pseudo-admin'))) {
    res.locals.managerPermission = true
    next()
  } else {
    // console.log('ELSE MANAGER')
    return next('route')
    // res.status(401)
    // throw new Error('Not authorized as Project Manager or Admin')
  }
}
const pseudoAdmin = (req, res, next) => {
  if (req.user && ((req.user.role == 'admin') || (req.user.role == 'pseudo-admin'))) {
    res.locals.adminPermission = true
    next()
  } else {
    // console.log('ELSE MANAGER')
    return next('route')
    // res.status(401)
    // throw new Error('Not authorized as Project Manager or Admin')
  }
}

const admin = (req, res, next) => {
  if (req.user && (req.user.role == 'admin')) {
    res.locals.adminPermission = true
    next()
  } else {
    // console.log('ELSE ADMIN')
    return next('route')
    // next('router') ???
  }
}

export {
  protect,
  admin,
  projectManager,
  Checks,
  pseudoAdmin
}
// export { protect, admin, alreadyLoggedIn }
