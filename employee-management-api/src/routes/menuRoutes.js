const express = require('express');
const router = express.Router();
const {
  getUserMenus,
  getAllMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
  reorderMenus
} = require('../controllers/menuController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

// Get user menus (available for all authenticated users)
router.get('/', getUserMenus);

// Super admin only routes
router.get('/all', isAdmin, getAllMenus);
router.get('/:id', isAdmin, getMenuById);
router.post('/', isAdmin, createMenu);
router.put('/reorder', isAdmin, reorderMenus);
router.put('/:id', isAdmin, updateMenu);
router.delete('/:id', isAdmin, deleteMenu);

module.exports = router;
