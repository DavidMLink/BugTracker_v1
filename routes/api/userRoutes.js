import express from 'express'
const router = express.Router()
import {
  authUser,
  logout,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from '../../controllers/postman/userController.js'
import { protect, admin } from '../../middleware/authMiddleware.js'

// NO PERMISSIONS
router.post('/', registerUser)
router.post('/login', authUser)

// LOGGED IN PERMSSIONS
router.get('/logout', protect, logout)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)


//ADMIN PERMISSIONS
router.get('/', protect, admin, getUsers)
router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)

export default router
