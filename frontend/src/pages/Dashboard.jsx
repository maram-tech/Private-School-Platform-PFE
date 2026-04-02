import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const roleEmoji = {
  ADMIN: '🛡️',
  TEACHER: '👨‍🏫',
  PARENT: '👪',
  STUDENT: '🎒',
}

const roleStats = {
  ADMIN:   [{ icon:'👥', label:'Total Users',    value:'--' }, { icon:'🏫', label:'Classes',       value:'--' }, { icon:'📋', label:'Reports',       value:'--' }, { icon:'📢', label:'Announcements', value:'--' }],
  TEACHER: [{ icon:'📚', label:'My Courses',     value:'--' }, { icon:'👨‍🎓', label:'Students',       value:'--' }, { icon:'📊', label:'Grades Entered', value:'--' }, { icon:'📅', label:'Attendance',    value:'--' }],
  PARENT:  [{ icon:'🎒', label:'My Children',    value:'--' }, { icon:'📊', label:'Latest Grades',  value:'--' }, { icon:'📅', label:'Absences',       value:'--' }, { icon:'📢', label:'New Messages',   value:'--' }],
  STUDENT: [{ icon:'📚', label:'My Courses',     value:'--' }, { icon:'📊', label:'My Grades',      value:'--' }, { icon:'📝', label:'Assignments',    value:'--' }, { icon:'📅', label:'Attendance',    value:'--' }],
}

const iconColors = ['purple', 'orange', 'green', 'pink']

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const stats = roleStats[user?.role] || roleStats.STUDENT
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <div className="dashboard-layout">

      {/* Navbar */}
      <nav className="dashboard-navbar">
        <div className="dashboard-logo">
          🎓 EduManage
        </div>
        <div className="dashboard-user">
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role?.toLowerCase()}</div>
          </div>
          <div className="user-avatar">{initials}</div>
          <button className="btn-logout" onClick={handleLogout} id="logout-btn">
            ↩ Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">

        {/* Welcome Card */}
        <div className="welcome-card">
          <h2>Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
          <p>Here's an overview of your school activity today.</p>
          <div className="role-badge">
            {roleEmoji[user?.role]} {user?.role?.charAt(0) + user?.role?.slice(1).toLowerCase()}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-icon ${iconColors[i]}`}>
                {s.icon}
              </div>
              <div className="stat-info">
                <h3>{s.value}</h3>
                <p>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}
