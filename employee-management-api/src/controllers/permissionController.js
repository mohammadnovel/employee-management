const db = require('../config/database');

// @desc    Get all permissions
// @route   GET /api/permissions
// @access  Private/Super Admin
const getAllPermissions = async (req, res) => {
  try {
    const [permissions] = await db.query(`
      SELECT 
        id,
        name,
        display_name,
        description,
        module,
        created_at
      FROM permissions
      ORDER BY module, name
    `);

    // Group by module
    const groupedPermissions = permissions.reduce((acc, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = [];
      }
      acc[permission.module].push(permission);
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        all: permissions,
        grouped: groupedPermissions
      }
    });
  } catch (error) {
    console.error('Get all permissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get permissions for a specific role
// @route   GET /api/permissions/role/:role
// @access  Private/Super Admin
const getRolePermissions = async (req, res) => {
  try {
    const { role } = req.params;

    // Validate role
    const validRoles = ['super_admin', 'admin', 'manager', 'user'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const [permissions] = await db.query(`
      SELECT 
        p.id,
        p.name,
        p.display_name,
        p.description,
        p.module
      FROM permissions p
      INNER JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role = ?
      ORDER BY p.module, p.name
    `, [role]);

    res.json({
      success: true,
      data: {
        role,
        permissions
      }
    });
  } catch (error) {
    console.error('Get role permissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update role permissions
// @route   PUT /api/permissions/role/:role
// @access  Private/Super Admin
const updateRolePermissions = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { role } = req.params;
    const { permission_ids } = req.body;

    // Validate role
    const validRoles = ['super_admin', 'admin', 'manager', 'user'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    // Validate permission_ids
    if (!Array.isArray(permission_ids)) {
      return res.status(400).json({
        success: false,
        message: 'permission_ids must be an array'
      });
    }

    // Prevent modifying super_admin permissions
    if (role === 'super_admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify super admin permissions'
      });
    }

    await connection.beginTransaction();

    // Delete existing role permissions
    await connection.query(
      'DELETE FROM role_permissions WHERE role = ?',
      [role]
    );

    // Insert new permissions
    if (permission_ids.length > 0) {
      const values = permission_ids.map(id => [role, id]);
      await connection.query(
        'INSERT INTO role_permissions (role, permission_id) VALUES ?',
        [values]
      );
    }

    await connection.commit();

    // Get updated permissions
    const [permissions] = await db.query(`
      SELECT 
        p.id,
        p.name,
        p.display_name,
        p.module
      FROM permissions p
      INNER JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role = ?
      ORDER BY p.module, p.name
    `, [role]);

    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, action, module, description, ip_address) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, 'UPDATE', 'permissions', `Updated permissions for role: ${role}`, req.ip]
    );

    res.json({
      success: true,
      message: 'Role permissions updated successfully',
      data: {
        role,
        permissions
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Update role permissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  } finally {
    connection.release();
  }
};

// @desc    Check if user has specific permission
// @route   POST /api/permissions/check
// @access  Private
const checkPermission = async (req, res) => {
  try {
    const { permission_name } = req.body;

    if (!permission_name) {
      return res.status(400).json({
        success: false,
        message: 'permission_name is required'
      });
    }

    const [[result]] = await db.query(`
      SELECT EXISTS(
        SELECT 1 
        FROM role_permissions rp
        INNER JOIN permissions p ON rp.permission_id = p.id
        WHERE rp.role = ? AND p.name = ?
      ) as has_permission
    `, [req.user.role, permission_name]);

    res.json({
      success: true,
      data: {
        permission: permission_name,
        has_permission: result.has_permission === 1
      }
    });
  } catch (error) {
    console.error('Check permission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all roles with permission counts
// @route   GET /api/permissions/roles/summary
// @access  Private/Super Admin
const getRolesSummary = async (req, res) => {
  try {
    const [roles] = await db.query(`
      SELECT 
        rp.role,
        COUNT(DISTINCT rp.permission_id) as total_permissions,
        GROUP_CONCAT(DISTINCT p.module ORDER BY p.module) as modules,
        COUNT(DISTINCT u.id) as user_count
      FROM role_permissions rp
      INNER JOIN permissions p ON rp.permission_id = p.id
      LEFT JOIN users u ON u.role = rp.role AND u.is_active = true
      GROUP BY rp.role
      ORDER BY total_permissions DESC
    `);

    res.json({
      success: true,
      data: roles
    });
  } catch (error) {
    console.error('Get roles summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getAllPermissions,
  getRolePermissions,
  updateRolePermissions,
  checkPermission,
  getRolesSummary
};
