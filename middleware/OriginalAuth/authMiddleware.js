import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import Ticket from '../models/ticketModel.js'
import Project from '../models/projectModel.js'

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

const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      // console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

const ownerTicket = asyncHandler(async (req, res, next) => {

  let ticket = await Ticket.findById(req.params._id)

  if (!ticket) {
    res.status(401)
    throw new Error('Ticket doesn\'t exist')
  }

  // // console.log(ticket.owner);
  // // console.log(req.user._id);

  if (req.user && ((ticket.owner.equals(req.user._id)) || (req.user.role == 'admin'))) {
    next()
  } else {
    res.status(401)
    throw new Error('You can not modify what someone else has submitted.')
  }

  // if (req.user && (req.user.role == 'owner') || (req.user.role == 'admin')) {
  //   next()
  // } else {
  //   res.status(401)
  //   throw new Error('You can not modify what someone else has submitted.')
  // }
})
const ownerProject = asyncHandler(async (req, res, next) => {

  let project = await Project.findById(req.params.id)

  if (!project) {
    res.status(401)
    throw new Error('Project doesn\'t exist')
  }

  // // console.log(project.owner);
  // // console.log(req.user._id);

  if (req.user && ((project.owner.equals(req.user._id)) || (req.user.role == 'admin'))) {
    next()
  } else {
    res.status(401)
    throw new Error('You can not modify what someone else has submitted.')
  }

  // if (req.user && (req.user.role == 'owner') || (req.user.role == 'admin')) {
  //   next()
  // } else {
  //   res.status(401)
  //   throw new Error('You can not modify what someone else has submitted.')
  // }
})

const projectManager = (req, res, next) => {
  if (req.user && (req.user.role == 'project manager') || (req.user.role == 'admin')) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as Project Manager or Admin')
  }
}

const admin = (req, res, next) => {
  if (req.user && (req.user.role == 'admin')) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as an admin')
  }
}

export { protect, admin, ownerTicket, ownerProject, projectManager }
// export { protect, admin, alreadyLoggedIn }
