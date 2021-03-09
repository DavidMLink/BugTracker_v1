import express from 'express';
var router = express.Router();

import {
  home,
  authUser,
  registerUser,
  registerPage,
  loginPage
  // forgotPassword
} from '../../controllers/homeController.js'
import { protect, admin } from '../../middleware/authMiddleware.js'

/* GET home page. */
router.get('/', home)
router.get('/register', registerPage)
router.get('/login', loginPage)

// POST
router.post('/register', registerUser)
router.post('/login', authUser)




export default router
