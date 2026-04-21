const prisma = require('../prisma')

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await prisma.class.findMany({
      select: {
        id: true,
        name: true,
        room: true,
        level: true,
        teacher: { select: { name: true } },
        academicYear: { select: { id: true, name: true } },
        _count: { select: { students: true } }
      }
    })
    res.json({ success: true, data: classes })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classes.', error: error.message })
  }
}

exports.getClassById = async (req, res) => {
  try {
    const { id } = req.params
    const klass = await prisma.class.findUnique({
      where: { id: parseInt(id) }
    })
    if (!klass) return res.status(404).json({ message: 'Class not found.' })
    res.json({ success: true, data: klass })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching class.', error: error.message })
  }
}

exports.createClass = async (req, res) => {
  try {
    const { name, room, teacherId, level, academicYearId } = req.body
    if (!name || !room || !teacherId) {
      return res.status(400).json({ message: 'Please provide name, room, and teacherId.' })
    }
    const klass = await prisma.class.create({
      data: {
        name,
        room,
        teacherId: Number.parseInt(teacherId, 10),
        level: level || 'PRIMARY',
        academicYearId: academicYearId ? Number.parseInt(academicYearId, 10) : null
      }
    })
    res.status(201).json({ success: true, data: klass, message: 'Class created.' })
  } catch (error) {
    res.status(500).json({ message: 'Error creating class.', error: error.message })
  }
}

exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.class.delete({
      where: { id: parseInt(id) }
    })
    res.json({ success: true, message: 'Class deleted.' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting class.', error: error.message })
  }
}

exports.assignStudentsToClass = async (req, res) => {
  try {
    const classId = Number.parseInt(req.params.id, 10)
    const { studentIds } = req.body

    if (!Array.isArray(studentIds)) {
      return res.status(400).json({ message: 'studentIds must be an array.' })
    }

    const klass = await prisma.class.update({
      where: { id: classId },
      data: {
        students: {
          set: studentIds.map((id) => ({ id: Number.parseInt(id, 10) }))
        }
      },
      include: {
        students: { select: { id: true, name: true, email: true } }
      }
    })

    res.json({ success: true, data: klass, message: 'Students assigned to class.' })
  } catch (error) {
    res.status(500).json({ message: 'Error assigning students to class.', error: error.message })
  }
}
