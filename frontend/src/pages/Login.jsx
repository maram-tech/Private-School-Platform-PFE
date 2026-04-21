import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginUser } from '../services/auth.service'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({ email: '', password: '', role: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password || !form.role) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      const res = await loginUser(form)
      login(res.data.user, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">

      {/* ── Left Banner ── */}
      <div className="auth-banner">
        <div className="banner-icon">🎓</div>
        <h2 className="banner-title">Welcome Back to EduManage</h2>
        <p className="banner-subtitle">
          Your all-in-one school management platform for teachers, parents, and students.
        </p>
        <div className="banner-stats">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Students</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">40+</div>
            <div className="stat-label">Teachers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">20+</div>
            <div className="stat-label">Classes</div>
          </div>
        </div>
      </div>

      {/* ── Right Form ── */}
      <div className="auth-form-side">
        <div className="auth-card">

          <div className="auth-header">
            <span className="auth-label">Sign In</span>
            <h1>Log in to your account</h1>
            <p>Enter your credentials to access the platform</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <input
                  id="email"
                  className="form-input"
                  type="email"
                  name="email"
                  placeholder="you@school.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
                <span className="input-icon">✉</span>
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  className="form-input"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <span className="input-icon">🔒</span>
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {/* Role */}
            <div className="form-group">
              <label className="form-label" htmlFor="role">Login As</label>
              <div className="input-wrapper">
                <select
                  id="role"
                  className="form-input"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="">Select your role</option>
                  <option value="STUDENT">Student</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="PARENT">Parent</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="login-submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ marginTop: '8px' }}
            >
              {loading ? <span className="spinner"></span> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>

          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register">Create one →</Link>
          </div>

        </div>
      </div>

    </div>
  )
}
