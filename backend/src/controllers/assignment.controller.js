const prisma = require('../prisma')

exports.createAssignment = async (req, res) => {
  try {
    const { courseId, title, description, dueDate } = req.body

    if (!courseId || !title || !dueDate) {
      return res.status(400).json({ message: 'Please provide courseId, title, and dueDate.' })
    }

    const assignment = await prisma.assignment.create({
      data: {
        courseId: Number.parseInt(courseId, 10),
        title,
        description,
        dueDate: new Date(dueDate)
      }
    })

    return res.status(201).json({ success: true, data: assignment, message: 'Assignment created.' })
  } catch (error) {
    return res.status(500).json({ message: 'Error creating assignment.', error: error.message })
  }
}

exports.getCourseAssignments = async (req, res) => {
  try {
    const courseId = Number.parseInt(req.params.courseId, 10)
    const assignments = await prisma.assignment.findMany({
      where: { courseId },
      orderBy: { dueDate: 'asc' }
    })
    return res.json({ success: true, data: assignments })
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching assignments.', error: error.message })
  }
}

exports.submitAssignment = async (req, res) => {
  try {
    const assignmentId = Number.parseInt(req.params.assignmentId, 10)
    const { studentId, content, fileUrl } = req.body

    if (!studentId) {
      return res.status(400).json({ message: 'Please provide studentId.' })
    }

    const submission = await prisma.submission.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId: Number.parseInt(studentId, 10)
        }
      },
      create: {
        assignmentId,
        studentId: Number.parseInt(studentId, 10),
        content,
        fileUrl
      },
      update: {
        content,
        fileUrl,
        submittedAt: new Date()
      }
    })

    return res.status(201).json({ success: true, data: submission, message: 'Submission saved.' })
  } catch (error) {
    return res.status(500).json({ message: 'Error submitting assignment.', error: error.message })
  }
}

exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const assignmentId = Number.parseInt(req.params.assignmentId, 10)
    const submissions = await prisma.submission.findMany({
      where: { assignmentId },
      include: { student: { select: { id: true, name: true, email: true } } },
      orderBy: { submittedAt: 'desc' }
    })

    return res.json({ success: true, data: submissions })
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching submissions.', error: error.message })
  }
}
