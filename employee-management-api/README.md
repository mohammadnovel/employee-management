# Employee Management API (Backend)

Backend API untuk Employee Management System dengan RBAC.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Edit file `.env` dan sesuaikan dengan database Anda:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=employee_management
```

### 3. Run Server
```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile
- `PUT /api/auth/change-password` - Change password

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/stats` - Get statistics
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Permissions
- `GET /api/permissions` - Get all permissions
- `POST /api/permissions/check` - Check permission

### Menus
- `GET /api/menus` - Get user menus

## Testing

```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"superadmin","password":"Password123"}'
```

## Security Features

- JWT Authentication
- Password Hashing (bcrypt)
- Input Validation
- SQL Injection Prevention
- Rate Limiting
- CORS Protection
- Helmet Security Headers
- File Upload Validation

## Project Structure

```
src/
├── config/         - Database configuration
├── controllers/    - Request handlers
├── middleware/     - Custom middleware
├── routes/         - API routes
└── validators/     - Input validation
```
