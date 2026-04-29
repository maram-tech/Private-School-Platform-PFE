import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  Users
} from 'lucide-react'

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

export const navigationItemsByRole = {
  ADMIN: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Users', path: '/users' },
    { icon: GraduationCap, label: 'Students', path: '/students' },
    { icon: Users, label: 'Teachers', path: '/teachers' },
    { icon: Users, label: 'Parents', path: '/parents' },
    { icon: CalendarDays, label: 'Academic Years', path: '/academic-years' },
    { icon: BookOpen, label: 'Classes', path: '/classes' },
    { icon: BookOpen, label: 'Courses', path: '/courses' },
    { icon: BookOpen, label: 'Assignments', path: '/assignments' },
    { icon: GraduationCap, label: 'Grades', path: '/grades' },
    { icon: CalendarDays, label: 'Attendance', path: '/attendance' },
    { icon: Megaphone, label: 'Announcements', path: '/announcements' },
    { icon: Megaphone, label: 'Messages', path: '/messages' },
    { icon: Megaphone, label: 'Notifications', path: '/notifications' }
  ],
  TEACHER: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: GraduationCap, label: 'Students', path: '/students' },
    { icon: BookOpen, label: 'Classes', path: '/classes' },
    { icon: BookOpen, label: 'Courses', path: '/courses' },
    { icon: BookOpen, label: 'Assignments', path: '/assignments' },
    { icon: GraduationCap, label: 'Grades', path: '/grades' },
    { icon: CalendarDays, label: 'Attendance', path: '/attendance' },
    { icon: Megaphone, label: 'Announcements', path: '/announcements' },
    { icon: Megaphone, label: 'Messages', path: '/messages' },
    { icon: Megaphone, label: 'Notifications', path: '/notifications' }
  ],
  PARENT: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: GraduationCap, label: 'Grades', path: '/grades' },
    { icon: CalendarDays, label: 'Attendance', path: '/attendance' },
    { icon: Megaphone, label: 'Announcements', path: '/announcements' },
    { icon: Megaphone, label: 'Messages', path: '/messages' },
    { icon: Megaphone, label: 'Notifications', path: '/notifications' }
  ],
  STUDENT: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: BookOpen, label: 'Classes', path: '/classes' },
    { icon: BookOpen, label: 'Courses', path: '/courses' },
    { icon: BookOpen, label: 'Assignments', path: '/assignments' },
    { icon: GraduationCap, label: 'Grades', path: '/grades' },
    { icon: CalendarDays, label: 'Attendance', path: '/attendance' },
    { icon: Megaphone, label: 'Announcements', path: '/announcements' },
    { icon: Megaphone, label: 'Notifications', path: '/notifications' }
  ]
}

export const sidebarItemsByRole = navigationItemsByRole
