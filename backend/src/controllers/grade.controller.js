const prisma = require('../prisma')
const { createAuditLog } = require('./audit.controller')

exports.createGrade = async (req, res) => {
  try {
    const { studentId, subject, score, maxScore, comments } = req.body

    if (!studentId || !subject || score === undefined) {
      return res.status(400).json({ message: 'Please provide studentId, subject, and score.' })
    }

    const created = await prisma.grade.create({
      data: {
        studentId: Number.parseInt(studentId, 10),
        teacherId: req.user?.id,
        subject,
        score: Number(score),
        maxScore: maxScore !== undefined ? Number(maxScore) : 20,
        comments
      }
    })

    await createAuditLog({
      actorId: req.user?.id,
      action: 'GRADE_CREATE',
      entityType: 'Grade',
      entityId: created.id,
      after: created,
      metadata: {
        studentId: Number.parseInt(studentId, 10),
        subject
      }
    })

    const parentLinks = await prisma.parentStudent.findMany({
      where: { studentId: Number.parseInt(studentId, 10) },
      select: { parentId: true }
    })

    if (parentLinks.length > 0) {
      await prisma.notification.createMany({
        data: parentLinks.map((link) => ({
          userId: link.parentId,
          type: 'GRADE',
          message: `New grade posted for ${subject}.`
        }))
      })
    }

    return res.status(201).json({ success: true, data: created, message: 'Grade recorded.' })
  } catch (error) {
    return res.status(500).json({ message: 'Error creating grade.', error: error.message })
  }
}

exports.getClassAverage = async (req, res) => {
  try {
    const classId = Number.parseInt(req.params.classId, 10)
    if (!Number.isInteger(classId) || classId <= 0) {
      return res.status(400).json({ message: 'Invalid classId.' })
    }

    const klass = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        teacher: { select: { id: true, email: true } },
        students: { select: { id: true, name: true } }
      }
    })

    if (!klass) {
      return res.status(404).json({ message: 'Class not found.' })
    }

    if (req.user?.role === 'TEACHER') {
      if (!klass.teacher || klass.teacher.email !== req.user.email) {
        return res.status(403).json({ message: 'Forbidden. You can only view averages for your own classes.' })
      }
    }

    if (req.user?.role === 'PARENT') {
      const parentChildren = await prisma.parentStudent.findMany({
        where: { parentId: req.user.id },
        select: {
          student: {
            select: {
              id: true,
              classes: { select: { id: true } }
            }
          }
        }
      })

      const hasChildInClass = parentChildren.some((link) =>
        (link.student?.classes || []).some((c) => c.id === classId)
      )

      if (!hasChildInClass) {
        return res.status(403).json({ message: 'Forbidden. Class is not linked to your children.' })
      }
    }

    const studentIds = klass.students.map((student) => student.id)
    if (!studentIds.length) {
      return res.json({
        success: true,
        data: {
          classId,
          className: klass.name,
          studentsCount: 0,
          gradesCount: 0,
          average: null,
          median: null,
          mode: null
        }
      })
    }

    const grades = await prisma.grade.findMany({
      where: { studentId: { in: studentIds } },
      select: { score: true }
    })

    const scores = grades.map((grade) => Number(grade.score)).filter((value) => Number.isFinite(value))
    if (!scores.length) {
      return res.json({
        success: true,
        data: {
          classId,
          className: klass.name,
          studentsCount: studentIds.length,
          gradesCount: 0,
          average: null,
          median: null,
          mode: null
        }
      })
    }

    const sorted = scores.slice().sort((a, b) => a - b)
    const average = sorted.reduce((sum, value) => sum + value, 0) / sorted.length
    const median =
      sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)]

    const frequency = {}
    sorted.forEach((value) => {
      frequency[value] = (frequency[value] || 0) + 1
    })

    let mode = sorted[0]
    let maxFrequency = 0
    Object.entries(frequency).forEach(([value, count]) => {
      if (count > maxFrequency) {
        maxFrequency = count
        mode = Number(value)
      }
    })

    return res.json({
      success: true,
      data: {
        classId,
        className: klass.name,
        studentsCount: studentIds.length,
        gradesCount: sorted.length,
        average,
        median,
        mode
      }
    })
  } catch (error) {
    return res.status(500).json({ message: 'Error calculating class average.', error: error.message })
  }
}

exports.getStudentGrades = async (req, res) => {
  try {
    const studentId = Number.parseInt(req.params.studentId, 10)
    const grades = await prisma.grade.findMany({
      where: { studentId },
      orderBy: { recordedAt: 'desc' }
    })
    return res.json({ success: true, data: grades })
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching grades.', error: error.message })
  }
}

exports.getStudentAverage = async (req, res) => {
  try {
    const studentId = Number.parseInt(req.params.studentId, 10)

    const grades = await prisma.grade.findMany({ where: { studentId } })
    if (grades.length === 0) {
      return res.json({ success: true, average: null, percentage: null, count: 0 })
    }

    const totalScore = grades.reduce((sum, g) => sum + g.score, 0)
    const totalMax = grades.reduce((sum, g) => sum + g.maxScore, 0)
    const average = totalScore / grades.length
    const percentage = totalMax > 0 ? (totalScore / totalMax) * 100 : null

    return res.json({
      success: true,
      average,
      percentage,
      count: grades.length
    })
  } catch (error) {
    return res.status(500).json({ message: 'Error calculating average.', error: error.message })
  }
}

exports.exportStudentGrades = async (req, res) => {
  try {
    const studentId = Number.parseInt(req.params.studentId, 10)
    const grades = await prisma.grade.findMany({
      where: { studentId },
      orderBy: { recordedAt: 'desc' }
    })

    const header = 'subject,score,maxScore,recordedAt,comments\n'
    const rows = grades
      .map((g) => `${g.subject},${g.score},${g.maxScore},${g.recordedAt.toISOString()},"${(g.comments || '').replace(/"/g, '""')}"`)
      .join('\n')

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="student-${studentId}-grades.csv"`)
    return res.send(header + rows)
  } catch (error) {
    return res.status(500).json({ message: 'Error exporting grades.', error: error.message })
  }
}
