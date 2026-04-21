const prisma = require('../prisma')

exports.getAllCourses = async (_req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        class: { select: { id: true, name: true } },
        teacher: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    return res.json({ success: true, data: courses })
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching courses.', error: error.message })
  }
}

exports.createCourse = async (req, res) => {
  try {
    const { title, description, classId } = req.body
    if (!title) {
      return res.status(400).json({ message: 'Please provide course title.' })
    }

    const created = await prisma.course.create({
      data: {
        title,
        description,
        classId: classId ? Number.parseInt(classId, 10) : null,
        teacherId: req.user?.id
      }
    })

    return res.status(201).json({ success: true, data: created, message: 'Course created.' })
  } catch (error) {
    return res.status(500).json({ message: 'Error creating course.', error: error.message })
  }
}

exports.addCourseMaterial = async (req, res) => {
  try {
    const courseId = Number.parseInt(req.params.courseId, 10)
    const { title, fileUrl } = req.body

    if (!title || !fileUrl) {
      return res.status(400).json({ message: 'Please provide title and fileUrl.' })
    }

    const material = await prisma.courseMaterial.create({
      data: { courseId, title, fileUrl }
    })

    return res.status(201).json({ success: true, data: material, message: 'Course material uploaded.' })
  } catch (error) {
    return res.status(500).json({ message: 'Error adding course material.', error: error.message })
  }
}

exports.getCourseMaterials = async (req, res) => {
  try {
    const courseId = Number.parseInt(req.params.courseId, 10)
    const materials = await prisma.courseMaterial.findMany({
      where: { courseId },
      orderBy: { createdAt: 'desc' }
    })
    return res.json({ success: true, data: materials })
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching course materials.', error: error.message })
  }
}
