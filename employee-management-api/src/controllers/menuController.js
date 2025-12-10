const db = require('../config/database');

// @desc    Get menus for current user based on role
// @route   GET /api/menus
// @access  Private
const getUserMenus = async (req, res) => {
  try {
    const [menus] = await db.query(`
      SELECT 
        m.id,
        m.parent_id,
        m.name,
        m.display_name,
        m.icon,
        m.url,
        m.order_no
      FROM menus m
      INNER JOIN menu_permissions mp ON m.id = mp.menu_id
      WHERE mp.role = ? AND m.is_active = true
      ORDER BY m.parent_id, m.order_no
    `, [req.user.role]);

    // Build tree structure
    const menuTree = buildMenuTree(menus);

    res.json({
      success: true,
      data: {
        menus: menuTree,
        flat: menus
      }
    });
  } catch (error) {
    console.error('Get user menus error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Helper function to build menu tree
const buildMenuTree = (menus) => {
  const menuMap = {};
  const tree = [];

  // Create a map of all menus
  menus.forEach(menu => {
    menuMap[menu.id] = { ...menu, children: [] };
  });

  // Build the tree
  menus.forEach(menu => {
    if (menu.parent_id === null) {
      tree.push(menuMap[menu.id]);
    } else if (menuMap[menu.parent_id]) {
      menuMap[menu.parent_id].children.push(menuMap[menu.id]);
    }
  });

  return tree;
};

// @desc    Get all menus (for admin management)
// @route   GET /api/menus/all
// @access  Private/Super Admin
const getAllMenus = async (req, res) => {
  try {
    const [menus] = await db.query(`
      SELECT 
        m.*,
        pm.display_name as parent_name,
        (SELECT COUNT(*) FROM menus WHERE parent_id = m.id) as children_count
      FROM menus m
      LEFT JOIN menus pm ON m.parent_id = pm.id
      ORDER BY m.parent_id, m.order_no
    `);

    res.json({
      success: true,
      data: menus
    });
  } catch (error) {
    console.error('Get all menus error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get menu by ID
// @route   GET /api/menus/:id
// @access  Private/Super Admin
const getMenuById = async (req, res) => {
  try {
    const [menus] = await db.query(
      'SELECT * FROM menus WHERE id = ?',
      [req.params.id]
    );

    if (menus.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found'
      });
    }

    // Get menu permissions
    const [permissions] = await db.query(
      'SELECT role FROM menu_permissions WHERE menu_id = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      data: {
        ...menus[0],
        roles: permissions.map(p => p.role)
      }
    });
  } catch (error) {
    console.error('Get menu by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new menu
// @route   POST /api/menus
// @access  Private/Super Admin
const createMenu = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const {
      parent_id,
      name,
      display_name,
      icon,
      url,
      order_no,
      is_active,
      roles
    } = req.body;

    // Validation
    if (!name || !display_name) {
      return res.status(400).json({
        success: false,
        message: 'Name and display name are required'
      });
    }

    // Check if menu name already exists
    const [existing] = await db.query(
      'SELECT id FROM menus WHERE name = ?',
      [name]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Menu name already exists'
      });
    }

    await connection.beginTransaction();

    // Insert menu
    const [result] = await connection.query(
      `INSERT INTO menus (parent_id, name, display_name, icon, url, order_no, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [parent_id || null, name, display_name, icon || null, url || null, order_no || 0, is_active !== false]
    );

    const menuId = result.insertId;

    // Insert menu permissions if roles provided
    if (roles && Array.isArray(roles) && roles.length > 0) {
      const values = roles.map(role => [menuId, role]);
      await connection.query(
        'INSERT INTO menu_permissions (menu_id, role) VALUES ?',
        [values]
      );
    }

    await connection.commit();

    // Get created menu
    const [menus] = await db.query(
      'SELECT * FROM menus WHERE id = ?',
      [menuId]
    );

    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, action, module, description, ip_address) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, 'CREATE', 'menus', `Created menu: ${display_name}`, req.ip]
    );

    res.status(201).json({
      success: true,
      message: 'Menu created successfully',
      data: menus[0]
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create menu error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  } finally {
    connection.release();
  }
};

// @desc    Update menu
// @route   PUT /api/menus/:id
// @access  Private/Super Admin
const updateMenu = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { id } = req.params;
    const {
      parent_id,
      name,
      display_name,
      icon,
      url,
      order_no,
      is_active,
      roles
    } = req.body;

    // Check if menu exists
    const [existing] = await db.query(
      'SELECT * FROM menus WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found'
      });
    }

    // Check if trying to set parent to self or child
    if (parent_id && parseInt(parent_id) === parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: 'Menu cannot be its own parent'
      });
    }

    await connection.beginTransaction();

    // Build update query
    const updates = [];
    const params = [];

    if (parent_id !== undefined) {
      updates.push('parent_id = ?');
      params.push(parent_id || null);
    }

    if (name) {
      // Check if new name already exists
      const [existingName] = await connection.query(
        'SELECT id FROM menus WHERE name = ? AND id != ?',
        [name, id]
      );
      if (existingName.length > 0) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Menu name already exists'
        });
      }
      updates.push('name = ?');
      params.push(name);
    }

    if (display_name) {
      updates.push('display_name = ?');
      params.push(display_name);
    }

    if (icon !== undefined) {
      updates.push('icon = ?');
      params.push(icon);
    }

    if (url !== undefined) {
      updates.push('url = ?');
      params.push(url);
    }

    if (order_no !== undefined) {
      updates.push('order_no = ?');
      params.push(order_no);
    }

    if (is_active !== undefined) {
      updates.push('is_active = ?');
      params.push(is_active);
    }

    if (updates.length > 0) {
      params.push(id);
      await connection.query(
        `UPDATE menus SET ${updates.join(', ')} WHERE id = ?`,
        params
      );
    }

    // Update menu permissions if provided
    if (roles && Array.isArray(roles)) {
      // Delete existing permissions
      await connection.query(
        'DELETE FROM menu_permissions WHERE menu_id = ?',
        [id]
      );

      // Insert new permissions
      if (roles.length > 0) {
        const values = roles.map(role => [id, role]);
        await connection.query(
          'INSERT INTO menu_permissions (menu_id, role) VALUES ?',
          [values]
        );
      }
    }

    await connection.commit();

    // Get updated menu
    const [menus] = await db.query(
      'SELECT * FROM menus WHERE id = ?',
      [id]
    );

    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, action, module, description, ip_address) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, 'UPDATE', 'menus', `Updated menu: ${display_name || existing[0].display_name}`, req.ip]
    );

    res.json({
      success: true,
      message: 'Menu updated successfully',
      data: menus[0]
    });
  } catch (error) {
    await connection.rollback();
    console.error('Update menu error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  } finally {
    connection.release();
  }
};

// @desc    Delete menu
// @route   DELETE /api/menus/:id
// @access  Private/Super Admin
const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if menu exists
    const [menus] = await db.query(
      'SELECT * FROM menus WHERE id = ?',
      [id]
    );

    if (menus.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found'
      });
    }

    // Check if menu has children
    const [[{ count }]] = await db.query(
      'SELECT COUNT(*) as count FROM menus WHERE parent_id = ?',
      [id]
    );

    if (count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete menu with submenus. Delete submenus first.'
      });
    }

    // Delete menu (cascade will delete menu_permissions)
    await db.query('DELETE FROM menus WHERE id = ?', [id]);

    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, action, module, description, ip_address) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, 'DELETE', 'menus', `Deleted menu: ${menus[0].display_name}`, req.ip]
    );

    res.json({
      success: true,
      message: 'Menu deleted successfully'
    });
  } catch (error) {
    console.error('Delete menu error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Reorder menus
// @route   PUT /api/menus/reorder
// @access  Private/Super Admin
const reorderMenus = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { menus } = req.body;

    if (!Array.isArray(menus) || menus.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid menus data'
      });
    }

    await connection.beginTransaction();

    // Update order for each menu
    for (const menu of menus) {
      await connection.query(
        'UPDATE menus SET order_no = ? WHERE id = ?',
        [menu.order_no, menu.id]
      );
    }

    await connection.commit();

    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, action, module, description, ip_address) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, 'UPDATE', 'menus', 'Reordered menus', req.ip]
    );

    res.json({
      success: true,
      message: 'Menus reordered successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Reorder menus error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  getUserMenus,
  getAllMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
  reorderMenus
};
