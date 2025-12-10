const db = require('../config/database')
const fs = require('fs').promises
const path = require('path')

// Get all employees with search, filter, and pagination
exports.getAllEmployees = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      department = '',
      status = '',
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query

    const offset = (parseInt(page) - 1) * parseInt(limit)

    let query = 'SELECT * FROM employees WHERE 1=1'
    const queryParams = []

    // Search
    if (search) {
      query += ` AND (full_name LIKE ? OR employee_code LIKE ? OR email LIKE ? OR phone LIKE ?)`
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`)
    }

    // Filter by department
    if (department) {
      query += ` AND department = ?`
      queryParams.push(department)
    }

    // Filter by status
    if (status) {
      query += ` AND status = ?`
      queryParams.push(status)
    }

    // Count total
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total')
    const [countResult] = await db.query(countQuery, queryParams)
    const total = countResult[0].total

    // Add sorting and pagination
    query += ` ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`
    queryParams.push(parseInt(limit), offset)

    const [employees] = await db.query(query, queryParams)

    res.json({
      success: true,
      data: {
        employees,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    })
  } catch (error) {
    console.error('Get employees error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees'
    })
  }
}

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const [employees] = await db.query(
      'SELECT * FROM employees WHERE id = ?',
      [req.params.id]
    )

    if (employees.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      })
    }

    res.json({
      success: true,
      data: { employee: employees[0] }
    })
  } catch (error) {
    console.error('Get employee error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee'
    })
  }
}

// Create employee
exports.createEmployee = async (req, res) => {
  try {
    const {
      employee_code,
      full_name,
      email,
      phone,
      address,
      position,
      department,
      salary,
      hire_date,
      birth_date,
      gender,
      status = 'Active'
    } = req.body

    const photo = req.file ? req.file.filename : null

    const [result] = await db.query(
      `INSERT INTO employees 
      (employee_code, full_name, email, phone, address, position, department, 
       salary, hire_date, birth_date, gender, photo, status, created_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employee_code,
        full_name,
        email,
        phone,
        address,
        position,
        department,
        salary,
        hire_date,
        birth_date,
        gender,
        photo,
        status,
        req.user.id
      ]
    )

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: { id: result.insertId }
    })
  } catch (error) {
    console.error('Create employee error:', error)
    
    // Delete uploaded file if error
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error)
    }

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Employee code or email already exists'
      })
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create employee'
    })
  }
}

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const {
      employee_code,
      full_name,
      email,
      phone,
      address,
      position,
      department,
      salary,
      hire_date,
      birth_date,
      gender,
      status
    } = req.body

    // Check if employee exists
    const [existing] = await db.query(
      'SELECT photo FROM employees WHERE id = ?',
      [req.params.id]
    )

    if (existing.length === 0) {
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error)
      }
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      })
    }
    console.log(req.file)
    const oldPhoto = existing[0].photo
    const newPhoto = req.file ? req.file.filename : oldPhoto

    await db.query(
      `UPDATE employees 
      SET employee_code = ?, full_name = ?, email = ?, phone = ?, 
          address = ?, position = ?, department = ?, salary = ?, 
          hire_date = ?, birth_date = ?, gender = ?, photo = ?, status = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        employee_code,
        full_name,
        email,
        phone,
        address,
        position,
        department,
        salary,
        hire_date,
        birth_date,
        gender,
        newPhoto,
        status,
        req.params.id
      ]
    )

    // Delete old photo if new photo uploaded
    if (req.file && oldPhoto) {
      const oldPhotoPath = path.join(__dirname, '../../uploads', oldPhoto)
      await fs.unlink(oldPhotoPath).catch(console.error)
    }

    res.json({
      success: true,
      message: 'Employee updated successfully'
    })
  } catch (error) {
    console.error('Update employee error:', error)

    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error)
    }

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Employee code or email already exists'
      })
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update employee'
    })
  }
}

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const [employees] = await db.query(
      'SELECT photo FROM employees WHERE id = ?',
      [req.params.id]
    )

    if (employees.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      })
    }

    await db.query('DELETE FROM employees WHERE id = ?', [req.params.id])

    // Delete photo file
    if (employees[0].photo) {
      const photoPath = path.join(__dirname, '../../uploads', employees[0].photo)
      await fs.unlink(photoPath).catch(console.error)
    }

    res.json({
      success: true,
      message: 'Employee deleted successfully'
    })
  } catch (error) {
    console.error('Delete employee error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee'
    })
  }
}

// Get employee statistics
exports.getStats = async (req, res) => {
  try {
    // Total employees
    const [totalResult] = await db.query(
      'SELECT COUNT(*) as total FROM employees'
    )

    // Status statistics
    const [statusStats] = await db.query(
      'SELECT status, COUNT(*) as count FROM employees GROUP BY status'
    )

    // Department statistics
    const [departmentStats] = await db.query(
      'SELECT department, COUNT(*) as count FROM employees GROUP BY department ORDER BY count DESC'
    )

    // Gender statistics
    const [genderStats] = await db.query(
      'SELECT gender, COUNT(*) as count FROM employees GROUP BY gender'
    )

    // Recent employees
    const [recentEmployees] = await db.query(
      'SELECT id, full_name, employee_code, position, department, hire_date FROM employees ORDER BY created_at DESC LIMIT 5'
    )

    res.json({
      success: true,
      data: {
        total: totalResult[0].total,
        statusStats,
        departmentStats,
        genderStats,
        recentEmployees
      }
    })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    })
  }
}
