const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { verifyToken } = require('../middleware/auth')
const { validateLogin } = require('../validators/authValidator')

// Public routes
router.post('/login', validateLogin, authController.login)

// Protected routes
router.get('/profile', verifyToken, authController.getProfile)
router.put('/change-password', verifyToken, authController.changePassword)

module.exports = router
