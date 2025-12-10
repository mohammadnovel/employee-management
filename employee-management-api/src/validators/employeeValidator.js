const { body, param, query, validationResult } = require('express-validator');

// Validation rules for creating employee
const createEmployeeValidation = [
  body('employee_code')
    .trim()
    .notEmpty()
    .withMessage('Employee code is required')
    .isLength({ min: 3, max: 20 })
    .withMessage('Employee code must be between 3 and 20 characters')
    .matches(/^[A-Z0-9-]+$/)
    .withMessage('Employee code can only contain uppercase letters, numbers, and hyphens'),
  body('full_name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Full name must be between 3 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Invalid phone number format'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address must not exceed 500 characters'),
  body('position')
    .trim()
    .notEmpty()
    .withMessage('Position is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Position must be between 2 and 50 characters'),
  body('department')
    .trim()
    .notEmpty()
    .withMessage('Department is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Department must be between 2 and 50 characters'),
  body('salary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Salary must be a positive number'),
  body('hire_date')
    .notEmpty()
    .withMessage('Hire date is required')
    .isISO8601()
    .withMessage('Invalid date format. Use YYYY-MM-DD'),
  body('birth_date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format. Use YYYY-MM-DD')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 17 || age > 100) {
        throw new Error('Age must be between 17 and 100 years');
      }
      return true;
    }),
  body('gender')
    .notEmpty()
    .withMessage('Gender is required')
    .isIn(['Male', 'Female'])
    .withMessage('Gender must be Male or Female'),
  body('status')
    .optional()
    .isIn(['Active', 'Inactive', 'Resigned'])
    .withMessage('Invalid status. Must be Active, Inactive, or Resigned')
];

// Validation rules for updating employee
const updateEmployeeValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid employee ID'),
  body('employee_code')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Employee code must be between 3 and 20 characters')
    .matches(/^[A-Z0-9-]+$/)
    .withMessage('Employee code can only contain uppercase letters, numbers, and hyphens'),
  body('full_name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Full name must be between 3 and 100 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Invalid phone number format'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address must not exceed 500 characters'),
  body('position')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Position must be between 2 and 50 characters'),
  body('department')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Department must be between 2 and 50 characters'),
  body('salary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Salary must be a positive number'),
  body('hire_date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format. Use YYYY-MM-DD'),
  body('birth_date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format. Use YYYY-MM-DD')
    .custom((value) => {
      if (value) {
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 17 || age > 100) {
          throw new Error('Age must be between 17 and 100 years');
        }
      }
      return true;
    }),
  body('gender')
    .optional()
    .isIn(['Male', 'Female'])
    .withMessage('Gender must be Male or Female'),
  body('status')
    .optional()
    .isIn(['Active', 'Inactive', 'Resigned'])
    .withMessage('Invalid status. Must be Active, Inactive, or Resigned')
];

// Validation for employee ID parameter
const employeeIdValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid employee ID')
];

// Validation for search/filter query
const searchValidation = [
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search query too long'),
  query('department')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Department filter too long'),
  query('position')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Position filter too long'),
  query('status')
    .optional()
    .isIn(['Active', 'Inactive', 'Resigned'])
    .withMessage('Invalid status filter'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sort_by')
    .optional()
    .isIn(['full_name', 'employee_code', 'hire_date', 'salary', 'created_at'])
    .withMessage('Invalid sort field'),
  query('sort_order')
    .optional()
    .isIn(['ASC', 'DESC', 'asc', 'desc'])
    .withMessage('Sort order must be ASC or DESC')
];

// Validation for attendance
const attendanceValidation = [
  body('employee_id')
    .isInt({ min: 1 })
    .withMessage('Invalid employee ID'),
  body('attendance_date')
    .notEmpty()
    .withMessage('Attendance date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('check_in')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('Invalid check-in time format (HH:MM:SS)'),
  body('check_out')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('Invalid check-out time format (HH:MM:SS)'),
  body('status')
    .notEmpty()
    .withMessage('Attendance status is required')
    .isIn(['Present', 'Absent', 'Leave', 'Late'])
    .withMessage('Invalid status'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters')
];

// Validation for leave request
const leaveValidation = [
  body('employee_id')
    .isInt({ min: 1 })
    .withMessage('Invalid employee ID'),
  body('leave_type')
    .notEmpty()
    .withMessage('Leave type is required')
    .isIn(['Annual', 'Sick', 'Personal', 'Unpaid'])
    .withMessage('Invalid leave type'),
  body('start_date')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Invalid start date format'),
  body('end_date')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('Invalid end date format')
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.start_date)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Reason is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Reason must be between 10 and 500 characters')
];

// Middleware to validate create employee
const validateCreateEmployee = [
  ...createEmployeeValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
];

// Middleware to validate update employee
const validateUpdateEmployee = [
  ...updateEmployeeValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
];

module.exports = {
  validateCreateEmployee,
  validateUpdateEmployee
};
