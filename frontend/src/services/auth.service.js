import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const API = axios.create({ baseURL: API_BASE_URL })

// Attach token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser   = (data) => API.post('/auth/login', data)
export const getMe       = ()     => API.get('/auth/me')
export const getAllUsers = ()     => API.get('/users')

// Students
export const getAllStudents = () => API.get('/students')
export const getStudentById = (id) => API.get(`/students/${id}`)
export const getMyChildren = () => API.get('/students/me/children')
export const createStudent = (data) => API.post('/students', data)
export const deleteStudent = (id) => API.delete(`/students/${id}`)

// Teachers
export const getAllTeachers = () => API.get('/teachers')
export const getTeacherById = (id) => API.get(`/teachers/${id}`)
export const createTeacher = (data) => API.post('/teachers', data)
export const deleteTeacher = (id) => API.delete(`/teachers/${id}`)

// Classes
export const getAllClasses = () => API.get('/classes')
export const getClassById = (id) => API.get(`/classes/${id}`)
export const createClass = (data) => API.post('/classes', data)
export const assignStudentsToClass = (id, data) => API.put(`/classes/${id}/students`, data)
export const deleteClass = (id) => API.delete(`/classes/${id}`)

// Academic Years
export const getAcademicYears = () => API.get('/academic-years')
export const createAcademicYear = (data) => API.post('/academic-years', data)
export const updateAcademicYear = (id, data) => API.patch(`/academic-years/${id}`, data)
export const deleteAcademicYear = (id) => API.delete(`/academic-years/${id}`)

// Student Management
export const linkParentToStudent = (studentId, data) => API.post(`/students/${studentId}/parents`, data)
export const getStudentProgress = (studentId) => API.get(`/students/${studentId}/progress`)

// Grades
export const createGrade = (data) => API.post('/grades', data)
export const getStudentGrades = (studentId) => API.get(`/grades/student/${studentId}`)
export const getStudentAverage = (studentId) => API.get(`/grades/student/${studentId}/average`)
export const getClassAverage = (classId) => API.get(`/grades/class/${classId}/average`)
export const exportStudentGrades = (studentId) => API.get(`/grades/student/${studentId}/export`)

// Attendance
export const markAttendance = (data) => API.post('/attendance', data)
export const getStudentAttendance = (studentId) => API.get(`/attendance/student/${studentId}`)
export const justifyAbsence = (attendanceId, data) => API.patch(`/attendance/${attendanceId}/justify`, data)

// Courses
export const getAllCourses = () => API.get('/courses')
export const createCourse = (data) => API.post('/courses', data)
export const getCourseMaterials = (courseId) => API.get(`/courses/${courseId}/materials`)
export const addCourseMaterial = (courseId, data) => API.post(`/courses/${courseId}/materials`, data)

// Assignments
export const createAssignment = (data) => API.post('/assignments', data)
export const getCourseAssignments = (courseId) => API.get(`/assignments/course/${courseId}`)
export const submitAssignment = (assignmentId, data) => API.post(`/assignments/${assignmentId}/submissions`, data)
export const getAssignmentSubmissions = (assignmentId) => API.get(`/assignments/${assignmentId}/submissions`)

// Communication
export const getAnnouncements = () => API.get('/announcements')
export const createAnnouncement = (data) => API.post('/announcements', data)
export const getInboxMessages = () => API.get('/messages/inbox')
export const sendMessage = (data) => API.post('/messages', data)

// Notifications
export const getMyNotifications = () => API.get('/notifications/me')
export const markNotificationAsRead = (id) => API.patch(`/notifications/${id}/read`)
export const markAllNotificationsAsRead = () => API.patch('/notifications/me/read-all')

// Audit (admin)
export const getAuditLogs = (limit = 100) => API.get(`/audit?limit=${limit}`)

export default API
