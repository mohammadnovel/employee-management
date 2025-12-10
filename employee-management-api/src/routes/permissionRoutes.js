const express = require('express');
const router = express.Router();
const {
  getAllPermissions,
  getRolePermissions,
  updateRolePermissions,
  checkPermission,
  getRolesSummary
} = require('../controllers/permissionController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

// Check single permission (available for all authenticated users)
router.post('/check', checkPermission);

// Super admin only routes
router.get('/', isAdmin, getAllPermissions);
router.get('/roles/summary', isAdmin, getRolesSummary);
router.get('/role/:role', isAdmin, getRolePermissions);
router.put('/role/:role', isAdmin, updateRolePermissions);

module.exports = router;
