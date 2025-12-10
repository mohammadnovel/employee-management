# Employee Management Frontend

Modern frontend untuk Employee Management System menggunakan Next.js 14 dengan dashboard interaktif dan RBAC.

## Features

- 🎨 Modern Dashboard dengan 3 interactive charts
- 🔐 Role-Based Access Control (RBAC)
- 📱 Fully Responsive Design
- 🎯 Dynamic Sidebar dengan hierarchical menus
- 📊 Real-time Statistics
- 🔒 Complete Security (JWT, CSRF, XSS Protection)
- 🎭 Beautiful UI dengan Bootstrap 5
- ⚡ Fast & Animated

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API URL
File `.env.local` sudah dikonfigurasi dengan:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_UPLOAD_URL=http://localhost:5000/uploads
```

### 3. Run Development Server
```bash
npm run dev
```

Buka browser di `http://localhost:3000`

## Login Credentials

Default users (password: `Password123`):

| Username | Role | Access |
|----------|------|--------|
| superadmin | Super Admin | Full Access (31/31) |
| admin | Admin | Admin Access (30/31) |
| manager1 | Manager | Manager Access (17/31) |
| user1 | User | Basic Access (7/31) |

## Dashboard Features

### Stat Cards
- Total Employees
- Active Employees
- Departments
- Pending Leave

### Charts
- **Line Chart** - Employee growth trend (12 months)
- **Doughnut Chart** - Attendance overview
- **Bar Chart** - Employees by department

### Quick Actions
- Add New Employee
- Mark Attendance
- Manage Leave Requests
- View Reports

## Project Structure

```
src/
├── app/                  - Next.js App Router
│   ├── layout.js        - Root layout
│   ├── page.js          - Home page
│   ├── login/           - Login page
│   └── dashboard/       - Dashboard page
├── components/
│   ├── AuthContext.js   - Auth state management
│   └── Layout/          - Layout components
├── lib/
│   ├── api.js          - API client
│   └── auth.js         - Auth helpers
└── styles/
    └── globals.css     - Global styles
```

## Build for Production

```bash
npm run build
npm start
```

## Environment Variables

For production, update:

```env
NEXT_PUBLIC_API_URL=https://api.yourcompany.com/api
NEXT_PUBLIC_UPLOAD_URL=https://api.yourcompany.com/uploads
```

## Dependencies

### Core
- next@14.0.4
- react@18.2.0
- react-dom@18.2.0

### UI
- bootstrap@5.3.2
- react-bootstrap@2.9.1
- bootstrap-icons@1.11.2

### Charts
- chart.js@4.4.1
- react-chartjs-2@5.2.0

### State & API
- axios@1.6.2
- js-cookie@3.0.5
- react-toastify@9.1.3

### Forms & Validation
- react-hook-form@7.48.2
- zod@3.22.4

## Security Features

- Route Protection (middleware)
- JWT in HTTP-only cookies
- Security Headers (CSP, HSTS)
- XSS Prevention (DOMPurify)
- CSRF Protection
- Input Sanitization
- API Error Handling
