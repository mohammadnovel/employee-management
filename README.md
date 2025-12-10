# 🚀 SETUP INSTRUCTIONS
## Complete Step-by-Step Guide

---

## 📋 PREREQUISITES

Pastikan sudah terinstall:

- ✅ **Node.js** v18.0.0 atau lebih tinggi
- ✅ **npm** v9.0.0 atau lebih tinggi
- ✅ **MySQL** 8.0.0 atau MariaDB 10.5+
- ✅ **Git** (optional)

### Verify Installations

```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
mysql --version   # Should show 8.x.x or higher
```

---

## 🗂️ FILE STRUCTURE

Setelah extract ZIP, Anda akan mendapatkan:

```
employee-management-system-COMPLETE/
│
├── employee-management-api/          # Backend (Node.js)
│   ├── src/
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── README.md
│
├── employee-management-frontend/     # Frontend (Next.js)
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── .env.local
│   ├── jsconfig.json
│   └── README.md
│
├── employee_management-202512110431.sql      # Database
│
└── Documentation/                     # Guides
    ├── README.md
    ├── QUICK_START.md
    ├── QUICK_FIX_GUIDE.md
    └── ... (9 more guides)
```

---

## ⚡ QUICK SETUP (10 MINUTES)

### Step 1: Extract ZIP

```bash
unzip employee-management-system-COMPLETE.zip
cd employee-management-system-COMPLETE
```

### Step 2: Setup Database

import database on .sql database 
**Alternative method:**
```bash
mysql -u root -p < employee_management-202512110431.sql
```

### Step 3: Setup Backend

```bash
cd employee-management-api

# Install dependencies
npm install

# Configure .env
nano .env
# Atau gunakan text editor favorit Anda
```

**Edit `.env` file:**

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here    # ← CHANGE THIS!
DB_NAME=employee_management
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-12345
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5100
NODE_ENV=development

# File Upload Configuration
UPLOAD_MAX_SIZE=300000
UPLOAD_ALLOWED_TYPES=image/jpeg,image/jpg

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Save and run:**

```bash
npm run dev
```

**Expected output:**
```
🚀 Server running on port 5100
📡 API: http://localhost:5100/api
❤️  Health: http://localhost:5100/api/health
```

### Step 4: Test Backend

Open new terminal:

```bash
# Test health endpoint
curl http://localhost:5100/api/health
```

**Expected response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-12-10T..."
}
```

**Test login:**
```bash
curl -X POST http://localhost:5100/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@company.com","password":"123456"}'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": 1, "email": "superadmin@company.com", ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Step 5: Setup Frontend

Open new terminal:

```bash
cd employee-management-frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

**Expected output:**
```
  ▲ Next.js 14.0.4
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.5s
```

### Step 6: Access Application

Open browser: **http://localhost:3000**

**Login with:**
- email: `superadmin@company.com`
- Password: `123456`

**You should see:**
- ✅ Beautiful login page
- ✅ Redirect to dashboard after login
- ✅ Dashboard with 3 charts
- ✅ Sidebar with menus
- ✅ No errors in console

---

## 🎯 DETAILED SETUP

### Database Setup (Detailed)

#### Option 1: MySQL Command Line

```bash
# Start MySQL (choose based on your OS)
# macOS
mysql.server start

# Linux
sudo service mysql start
# or
sudo systemctl start mysql

# Windows (as Administrator)
net start MySQL80

# Login to MySQL
mysql -u root -p
```

#### Option 2: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Click **File** → **Run SQL Script**
4. Select `employee_management-202512110431.sql`
5. Click **Run**

#### Option 3: Using phpMyAdmin

1. Open phpMyAdmin in browser
2. Create new database: `employee_management`
3. Click **Import** tab
4. Choose `employee_management-202512110431.sql`
5. Click **Go**

#### Verify Database

```sql
USE employee_management;

-- Check tables (should be 10)
SHOW TABLES;

-- Check users (should be 7)
SELECT email, role FROM users;

-- Check employees (should be 22)
SELECT COUNT(*) as total FROM employees;
```

### Backend Setup (Detailed)

#### Install Dependencies Explanation

```bash
npm install
```

**This installs:**
- express - Web framework
- mysql2 - MySQL driver
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- dotenv - Environment variables
- cors - Cross-origin requests
- multer - File uploads
- express-validator - Input validation
- helmet - Security headers
- express-rate-limit - Rate limiting
- compression - Response compression
- morgan - HTTP logger

**Development dependency:**
- nodemon - Auto-restart on changes

#### Environment Variables Explained

```env
# Database
DB_HOST=localhost          # MySQL host (usually localhost)
DB_USER=root              # MySQL email
DB_PASSWORD=xxx           # YOUR MySQL password
DB_NAME=employee_management  # Database name
DB_PORT=3306              # MySQL port (default 3306)

# JWT
JWT_SECRET=xxx            # Secret key for JWT (change in production!)
JWT_EXPIRES_IN=7d         # Token expiration (7 days)

# Server
PORT=5100                 # API port
NODE_ENV=development      # Environment (development/production)

# Upload
UPLOAD_MAX_SIZE=300000    # Max file size (300KB)
UPLOAD_ALLOWED_TYPES=image/jpeg,image/jpg  # Allowed file types

# CORS
CORS_ORIGIN=http://localhost:3000  # Frontend URL

# Rate Limit
RATE_LIMIT_WINDOW_MS=900000      # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100      # Max 100 requests per window
```

#### Running Backend

```bash
# Development mode (auto-restart)
npm run dev

# Production mode
npm start
```

### Frontend Setup (Detailed)

#### Install Dependencies Explanation

```bash
npm install
```

**This installs:**

**Core:**
- next - React framework
- react & react-dom - React library

**UI:**
- bootstrap - CSS framework
- react-bootstrap - Bootstrap components
- bootstrap-icons - Icon library

**Charts:**
- chart.js - Chart library
- react-chartjs-2 - React wrapper for Chart.js

**API & State:**
- axios - HTTP client
- js-cookie - Cookie management
- react-toastify - Toast notifications

**Forms:**
- react-hook-form - Form handling
- zod - Schema validation

**Security:**
- dompurify - XSS protection

**Utils:**
- date-fns - Date formatting

#### Configuration Files

**jsconfig.json** (Path aliases)
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]  // Allows @/lib/auth instead of ../../../lib/auth
    }
  }
}
```

**.env.local** (Environment variables)
```env
NEXT_PUBLIC_API_URL=http://localhost:5100/api
NEXT_PUBLIC_UPLOAD_URL=http://localhost:5100/uploads
```

**next.config.js** (Next.js configuration)
- Security headers
- Image optimization
- Power-by header disabled

#### Running Frontend

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

---

## 🔍 VERIFICATION CHECKLIST

After setup, verify everything works:

### ✅ Backend Checklist

- [ ] MySQL server is running
- [ ] Database `employee_management` exists
- [ ] 10 tables created in database
- [ ] Backend runs without errors
- [ ] Health endpoint returns success
- [ ] Login endpoint returns token
- [ ] No console errors

**Commands to verify:**
```bash
# Check MySQL
mysql -u root -p -e "SHOW DATABASES;" | grep employee_management

# Check backend
curl http://localhost:5100/api/health

# Check login
curl -X POST http://localhost:5100/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@company.com","password":"123456"}' | jq .
```

### ✅ Frontend Checklist

- [ ] Frontend runs without errors
- [ ] Page loads at localhost:3000
- [ ] Login page appears
- [ ] Can login successfully
- [ ] Dashboard loads with charts
- [ ] Sidebar shows menus
- [ ] No console errors in browser

**How to verify:**
1. Open http://localhost:3000
2. Check browser console (F12) - should be no errors
3. Login with superadmin@company.com/123456
4. Dashboard should load
5. Charts should render
6. Sidebar should show menus

---

## 🐛 TROUBLESHOOTING

### Backend Issues

#### Error: ECONNREFUSED

**Problem:** Cannot connect to MySQL

**Solution:**
```bash
# Check MySQL is running
# macOS
mysql.server status

# Linux
sudo service mysql status

# Start if not running
mysql.server start
# or
sudo service mysql start
```

#### Error: Access denied for user

**Problem:** Wrong MySQL credentials

**Solution:**
```bash
# Verify MySQL credentials
mysql -u root -p
# Enter the same password as in .env

# If you forgot password, reset it:
mysql_secure_installation
```

#### Error: ER_BAD_DB_ERROR

**Problem:** Database doesn't exist

**Solution:**
```bash
mysql -u root -p
CREATE DATABASE employee_management;
USE employee_management;
source superadmin.sql;
```

#### Error: Port 5100 already in use

**Problem:** Port is occupied

**Solution:**
```bash
# Find and kill process
lsof -ti:5100 | xargs kill -9

# Or change port in .env
PORT=5001
```

### Frontend Issues

#### Error: Module not found

**Problem:** Dependencies not installed or jsconfig.json missing

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json .next
npm install

# Make sure jsconfig.json exists
cat jsconfig.json
```

#### Error: Network Error

**Problem:** Backend not running or CORS issue

**Solution:**
```bash
# Check backend is running
curl http://localhost:5100/api/health

# Check .env.local
cat .env.local

# Check backend .env CORS setting
cat ../employee-management-api/.env | grep CORS
```

#### Error: Page not found

**Problem:** Routing issue or build cache

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev
```

---

## 📞 NEED HELP?

### Check Documentation

1. **QUICK_START.md** - 5-step quick setup
2. **QUICK_FIX_GUIDE.md** - Common errors & solutions
3. **README.md** - Main overview
4. **TESTING_GUIDE.md** - All test scenarios

### Debug Tips

**Backend Debugging:**
```bash
# Check logs in terminal where backend is running
# Errors will show in red

# Test endpoints manually
curl -v http://localhost:5100/api/health
```

**Frontend Debugging:**
```bash
# Check browser console (F12)
# Network tab shows API calls
# Console tab shows errors
```

**Database Debugging:**
```bash
mysql -u root -p employee_management

# Check tables
SHOW TABLES;

# Check users
SELECT * FROM users;

# Check permissions
SELECT * FROM permissions LIMIT 5;
```

---

## 🎉 SUCCESS!

If everything works:

✅ Backend running on http://localhost:5100
✅ Frontend running on http://localhost:3000
✅ Can login and see dashboard
✅ Charts loading properly
✅ No errors in console

**Next steps:**
1. Explore the dashboard
2. Try different user roles
3. Test CRUD operations
4. Check permissions system
5. Review documentation

---

## 📚 ADDITIONAL RESOURCES

- **API Documentation:** See backend README.md
- **Frontend Guide:** See FRONTEND_DOCUMENTATION.md
- **RBAC Guide:** See RBAC_GUIDE.md
- **Security Guide:** See FULL_STACK_DOCUMENTATION.md
- **Testing Guide:** See TESTING_GUIDE.md

---

**Setup Time: ~10 minutes**
**Difficulty: Easy**
**Support: See documentation**

