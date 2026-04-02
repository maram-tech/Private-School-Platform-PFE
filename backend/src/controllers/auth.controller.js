const bcrypt    = require('bcryptjs')
const jwt       = require('jsonwebtoken')
const prisma    = require('../prisma')

// Helper to generate a JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// ─────────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // 1. Validate fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    }

    // 2. Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' })
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4. Create user (role defaults to STUDENT — admin changes it later)
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    })

    // 5. Generate token and respond
    const token = generateToken(user)
    return res.status(201).json({ user, token })

  } catch (error) {
    console.error('Register error:', error)
    return res.status(500).json({ message: 'Server error. Please try again.' })
  }
}

// ─────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // 1. Validate
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    // 2. Find user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    // 4. Return token (never return the password)
    const { password: _, ...userWithoutPassword } = user
    const token = generateToken(userWithoutPassword)
    return res.status(200).json({ user: userWithoutPassword, token })

  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'Server error. Please try again.' })
  }
}

// ─────────────────────────────────────────────
// GET /api/auth/me  (protected)
// ─────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    })
    if (!user) return res.status(404).json({ message: 'User not found.' })
    return res.status(200).json({ user })
  } catch (error) {
    console.error('GetMe error:', error)
    return res.status(500).json({ message: 'Server error.' })
  }
}

module.exports = { register, login, getMe }
