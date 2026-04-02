require('dotenv').config()
const express = require('express')
const cors    = require('cors')

const authRoutes = require('./routes/auth.routes')

const app  = express()
const PORT = process.env.PORT || 5000

// ── Middlewares ──────────────────────────────
app.use(cors({
  origin: 'http://localhost:3000',   // React dev server
  credentials: true
}))
app.use(express.json())

// ── Routes ───────────────────────────────────
app.use('/api/auth', authRoutes)

// ── Health check ─────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EduManage API is running 🚀' })
})

// ── 404 handler ──────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' })
})

// ── Start server ─────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`)
  console.log(`📡 API: http://localhost:${PORT}/api/auth\n`)
})
