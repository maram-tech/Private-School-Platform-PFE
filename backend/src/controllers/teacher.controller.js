const prisma = require('../prisma')

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await prisma.teacher.findMany({
      select: { id: true, name: true, email: true, subject: true }
    })
    res.json({ success: true, data: teachers })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teachers.', error: error.message })
  }
}

exports.getTeacherById = async (req, res) => {
  try {
    const { id } = req.params
    const teacher = await prisma.teacher.findUnique({
      where: { id: parseInt(id) }
    })
    if (!teacher) return res.status(404).json({ message: 'Teacher not found.' })
    res.json({ success: true, data: teacher })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teacher.', error: error.message })
  }
}

exports.createTeacher = async (req, res) => {
  try {
    const { name, email, subject } = req.body
    if (!name || !email || !subject) {
      return res.status(400).json({ message: 'Please provide name, email, and subject.' })
    }
    const teacher = await prisma.teacher.create({
      data: { name, email, subject }
    })
    res.status(201).json({ success: true, data: teacher, message: 'Teacher created.' })
  } catch (error) {
    res.status(500).json({ message: 'Error creating teacher.', error: error.message })
  }
}

exports.deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.teacher.delete({
      where: { id: parseInt(id) }
    })
    res.json({ success: true, message: 'Teacher deleted.' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting teacher.', error: error.message })
  }
}
