const express = require('express')
const router = express.Router()
const employeeController = require('../controllers/employeeController')
const { verifyToken } = require('../middleware/auth')
const { hasPermission } = require('../middleware/permission')
const upload = require('../middleware/upload')
const {
  validateCreateEmployee,
  validateUpdateEmployee
} = require('../validators/employeeValidator')

// All routes require authentication
router.use(verifyToken)

// Get stats - accessible to all authenticated users
router.get('/stats', employeeController.getStats)

// List employees - requires employees.view permission
router.get('/', hasPermission('employees.view'), employeeController.getAllEmployees)

// Get single employee
router.get('/:id', hasPermission('employees.view'), employeeController.getEmployeeById)

// Create employee - requires employees.create permission
router.post(
  '/',
  hasPermission('employees.create'),
  upload.single('photo'),
  validateCreateEmployee,
  employeeController.createEmployee
)

// Update employee - requires employees.edit permission
router.post(
  '/:id',
  hasPermission('employees.edit'),
  upload.single('photo'),
  validateUpdateEmployee,
  employeeController.updateEmployee
)

// Delete employee - requires employees.delete permission
router.delete('/:id', hasPermission('employees.delete'), employeeController.deleteEmployee)

module.exports = router
