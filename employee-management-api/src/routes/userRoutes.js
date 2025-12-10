const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { verifyToken, isAdmin } = require('../middleware/auth')
const { 
  validateCreateUser, 
  validateUpdateUser 
} = require('../validators/userValidator')

// All routes require authentication and admin role
router.use(verifyToken, isAdmin)

router.get('/', userController.getAllUsers)
router.get('/:id', userController.getUserById)
router.post('/', validateCreateUser, userController.createUser)
router.put('/:id', validateUpdateUser, userController.updateUser)
router.delete('/:id', userController.deleteUser)

module.exports = router
