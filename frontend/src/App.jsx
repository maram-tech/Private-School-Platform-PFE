import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login     from './pages/Login'
import Register  from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile   from './pages/Profile'
import Students  from './pages/Students'
import Teachers  from './pages/Teachers'
import Classes   from './pages/Classes'
import Users     from './pages/Users'
import AcademicYears from './pages/AcademicYears'
import Grades    from './pages/Grades'
import Attendance from './pages/Attendance'
import Courses   from './pages/Courses'
import Assignments from './pages/Assignments'
import Announcements from './pages/Announcements'
import Messages  from './pages/Messages'
import Notifications from './pages/Notifications'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/students" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
            <Students />
          </ProtectedRoute>
        } />
        <Route path="/teachers" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Teachers />
          </ProtectedRoute>
        } />
        <Route path="/classes" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER', 'STUDENT']}>
            <Classes />
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Users />
          </ProtectedRoute>
        } />
        <Route path="/academic-years" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AcademicYears />
          </ProtectedRoute>
        } />
        <Route path="/grades" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER', 'PARENT', 'STUDENT']}>
            <Grades />
          </ProtectedRoute>
        } />
        <Route path="/attendance" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER', 'PARENT', 'STUDENT']}>
            <Attendance />
          </ProtectedRoute>
        } />
        <Route path="/courses" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER', 'STUDENT']}>
            <Courses />
          </ProtectedRoute>
        } />
        <Route path="/assignments" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER', 'STUDENT']}>
            <Assignments />
          </ProtectedRoute>
        } />
        <Route path="/announcements" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER', 'PARENT', 'STUDENT']}>
            <Announcements />
          </ProtectedRoute>
        } />
        <Route path="/messages" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER', 'PARENT']}>
            <Messages />
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER', 'PARENT', 'STUDENT']}>
            <Notifications />
          </ProtectedRoute>
        } />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
