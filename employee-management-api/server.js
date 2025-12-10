require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const compression = require('compression')
const morgan = require('morgan')
const path = require('path')

const app = express()

/* ======================================================
   GLOBAL MIDDLEWARE
====================================================== */
app.use(helmet())
app.use(compression())
app.use(morgan('dev'))

/* ======================================================
   CORS CONFIG (API)
====================================================== */
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'

app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

/* ======================================================
   BODY PARSER
====================================================== */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* ======================================================
   ✅ STATIC FILES (UPLOADS) — FIXED CORS
====================================================== */
app.use(
  '/uploads',
  cors({
    origin: CLIENT_URL,
    credentials: true
  }),
  (req, res, next) => {
    // WAJIB agar image boleh dipakai lintas origin
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
    next()
  },
  express.static(path.join(__dirname, 'uploads'))
)

/* ======================================================
   RATE LIMITER (API ONLY)
====================================================== */
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.'
})

app.use('/api/', limiter)

/* ======================================================
   ROUTES
====================================================== */
const authRoutes = require('./src/routes/authRoutes')
const userRoutes = require('./src/routes/userRoutes')
const employeeRoutes = require('./src/routes/employeeRoutes')
const permissionRoutes = require('./src/routes/permissionRoutes')
const menuRoutes = require('./src/routes/menuRoutes')

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/employees', employeeRoutes)
app.use('/api/permissions', permissionRoutes)
app.use('/api/menus', menuRoutes)

/* ======================================================
   HEALTH CHECK
====================================================== */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  })
})

/* ======================================================
   404 HANDLER
====================================================== */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

/* ======================================================
   ERROR HANDLER
====================================================== */
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  })
})

/* ======================================================
   SERVER START
====================================================== */
const PORT = process.env.PORT || 5100
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📡 API        : http://localhost:${PORT}/api`)
  console.log(`🖼  Uploads   : http://localhost:${PORT}/uploads`)
})

/* ======================================================
   GRACEFUL SHUTDOWN
====================================================== */
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

function shutdown() {
  console.log('🛑 Shutting down server...')
  server.close(() => {
    console.log('✅ Server closed')
    process.exit(0)
  })
}

module.exports = app
