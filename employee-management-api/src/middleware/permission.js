const db = require('../config/database');

// Cache for permissions (to reduce database queries)
const permissionCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Clear cache periodically
setInterval(() => {
  permissionCache.clear();
}, CACHE_TTL);

/**
 * Middleware to check if user has required permission
 * @param {string} permissionName - Name of the permission to check
 * @returns {Function} Express middleware function
 */
const hasPermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      const userRole = req.user.role;
      const cacheKey = `${userRole}:${permissionName}`;

      // Check cache first
      if (permissionCache.has(cacheKey)) {
        const cachedResult = permissionCache.get(cacheKey);
        if (cachedResult.hasPermission) {
          return next();
        } else {
          return res.status(403).json({
            success: false,
            message: 'You do not have permission to perform this action',
            required_permission: permissionName
          });
        }
      }

      // Super admin always has access
      if (userRole === 'super_admin') {
        permissionCache.set(cacheKey, { hasPermission: true });
        return next();
      }

      // Check permission in database
      const [[result]] = await db.query(`
        SELECT EXISTS(
          SELECT 1 
          FROM role_permissions rp
          INNER JOIN permissions p ON rp.permission_id = p.id
          WHERE rp.role = ? AND p.name = ?
        ) as has_permission
      `, [userRole, permissionName]);

      const hasPermission = result.has_permission === 1;

      // Cache the result
      permissionCache.set(cacheKey, { hasPermission });

      if (hasPermission) {
        next();
      } else {
        res.status(403).json({
          success: false,
          message: 'You do not have permission to perform this action',
          required_permission: permissionName
        });
      }
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Error checking permissions'
      });
    }
  };
};

/**
 * Middleware to check if user has any of the required permissions
 * @param {Array<string>} permissionNames - Array of permission names
 * @returns {Function} Express middleware function
 */
const hasAnyPermission = (permissionNames) => {
  return async (req, res, next) => {
    try {
      const userRole = req.user.role;

      // Super admin always has access
      if (userRole === 'super_admin') {
        return next();
      }

      // Check if user has any of the required permissions
      const placeholders = permissionNames.map(() => '?').join(',');
      const [[result]] = await db.query(`
        SELECT EXISTS(
          SELECT 1 
          FROM role_permissions rp
          INNER JOIN permissions p ON rp.permission_id = p.id
          WHERE rp.role = ? AND p.name IN (${placeholders})
        ) as has_permission
      `, [userRole, ...permissionNames]);

      if (result.has_permission === 1) {
        next();
      } else {
        res.status(403).json({
          success: false,
          message: 'You do not have permission to perform this action',
          required_permissions: permissionNames
        });
      }
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Error checking permissions'
      });
    }
  };
};

/**
 * Middleware to check if user has all required permissions
 * @param {Array<string>} permissionNames - Array of permission names
 * @returns {Function} Express middleware function
 */
const hasAllPermissions = (permissionNames) => {
  return async (req, res, next) => {
    try {
      const userRole = req.user.role;

      // Super admin always has access
      if (userRole === 'super_admin') {
        return next();
      }

      // Check if user has all required permissions
      const placeholders = permissionNames.map(() => '?').join(',');
      const [[result]] = await db.query(`
        SELECT COUNT(DISTINCT p.name) as permission_count
        FROM role_permissions rp
        INNER JOIN permissions p ON rp.permission_id = p.id
        WHERE rp.role = ? AND p.name IN (${placeholders})
      `, [userRole, ...permissionNames]);

      if (result.permission_count === permissionNames.length) {
        next();
      } else {
        res.status(403).json({
          success: false,
          message: 'You do not have all required permissions',
          required_permissions: permissionNames
        });
      }
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Error checking permissions'
      });
    }
  };
};

/**
 * Clear permission cache (useful when permissions are updated)
 */
const clearPermissionCache = () => {
  permissionCache.clear();
};

module.exports = {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  clearPermissionCache
};
