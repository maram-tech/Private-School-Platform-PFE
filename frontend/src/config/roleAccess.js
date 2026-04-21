export const dashboardModulesByRole = {
  ADMIN: [
    'Manage users',
    'Manage classes',
    'Manage academic years',
    'Manage teachers',
    'Manage reports'
  ],
  TEACHER: [
    'Manage grades',
    'Manage attendance',
    'Manage courses',
    'Manage parent communication'
  ],
  PARENT: [
    'View children profiles',
    'View grades',
    'View attendance',
    'View announcements'
  ],
  STUDENT: [
    'Access timetable',
    'Access grades',
    'Access assignments',
    'Access course materials'
  ]
}

export const sidebarItemsByRole = {
  ADMIN: [
    { icon: '📊', label: 'Overview', path: '/dashboard' },
    { icon: '👤', label: 'Profile', path: '/profile' },
    { icon: '🧑‍💼', label: 'Users', path: '/users' },
    { icon: '📅', label: 'Academic Years', path: '/academic-years' },
    { icon: '👨‍🏫', label: 'Teachers', path: '/teachers' },
    { icon: '🏫', label: 'Classes', path: '/classes' },
    { icon: '📘', label: 'Courses', path: '/courses' },
    { icon: '📝', label: 'Assignments', path: '/assignments' },
    { icon: '📈', label: 'Grades', path: '/grades' },
    { icon: '📍', label: 'Attendance', path: '/attendance' },
    { icon: '📢', label: 'Announcements', path: '/announcements' },
    { icon: '✉️', label: 'Messages', path: '/messages' },
    { icon: '🔔', label: 'Notifications', path: '/notifications' }
  ],
  TEACHER: [
    { icon: '📊', label: 'Overview', path: '/dashboard' },
    { icon: '👤', label: 'Profile', path: '/profile' },
    { icon: '🎒', label: 'Students', path: '/students' },
    { icon: '🏫', label: 'Classes', path: '/classes' },
    { icon: '📘', label: 'Courses', path: '/courses' },
    { icon: '📝', label: 'Assignments', path: '/assignments' },
    { icon: '📈', label: 'Grades', path: '/grades' },
    { icon: '📍', label: 'Attendance', path: '/attendance' },
    { icon: '📢', label: 'Announcements', path: '/announcements' },
    { icon: '✉️', label: 'Messages', path: '/messages' },
    { icon: '🔔', label: 'Notifications', path: '/notifications' }
  ],
  PARENT: [
    { icon: '📊', label: 'Overview', path: '/dashboard' },
    { icon: '👤', label: 'Profile', path: '/profile' },
    { icon: '📈', label: 'Grades', path: '/grades' },
    { icon: '📍', label: 'Attendance', path: '/attendance' },
    { icon: '📢', label: 'Announcements', path: '/announcements' },
    { icon: '✉️', label: 'Messages', path: '/messages' },
    { icon: '🔔', label: 'Notifications', path: '/notifications' }
  ],
  STUDENT: [
    { icon: '📊', label: 'Overview', path: '/dashboard' },
    { icon: '👤', label: 'Profile', path: '/profile' },
    { icon: '🏫', label: 'Classes', path: '/classes' },
    { icon: '📘', label: 'Courses', path: '/courses' },
    { icon: '📝', label: 'Assignments', path: '/assignments' },
    { icon: '📈', label: 'Grades', path: '/grades' },
    { icon: '📍', label: 'Attendance', path: '/attendance' },
    { icon: '📢', label: 'Announcements', path: '/announcements' },
    { icon: '🔔', label: 'Notifications', path: '/notifications' }
  ]
}
