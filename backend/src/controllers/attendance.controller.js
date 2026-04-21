const prisma = require('../prisma')
const { createAuditLog } = require('./audit.controller')

exports.markAttendance = async (req, res) => {
  try {
    const { studentId, date, status, justification } = req.body

    if (!studentId || !date || !status) {
      return res.status(400).json({ message: 'Please provide studentId, date, and status.' })
    }

    if (!['PRESENT', 'ABSENT'].includes(status)) {
      return res.status(400).json({ message: 'status must be PRESENT or ABSENT.' })
    }

    const attendanceDate = new Date(date)

    const record = await prisma.attendance.upsert({
      where: {
        studentId_date: {
          studentId: Number.parseInt(studentId, 10),
          date: attendanceDate
        }
      },
      create: {
        studentId: Number.parseInt(studentId, 10),
        date: attendanceDate,
        status,
        justification,
        takenById: req.user?.id
      },
      update: {
        status,
        justification,
        takenById: req.user?.id
      }
    })

    await createAuditLog({
      actorId: req.user?.id,
      action: 'ATTENDANCE_UPSERT',
      entityType: 'Attendance',
      entityId: record.id,
      after: {
        studentId: record.studentId,
        date: record.date,
        status: record.status,
        justification: record.justification
      }
    })

    if (status === 'ABSENT') {
      const parentLinks = await prisma.parentStudent.findMany({
        where: { studentId: Number.parseInt(studentId, 10) },
        select: { parentId: true }
      })

      if (parentLinks.length > 0) {
        await prisma.notification.createMany({
          data: parentLinks.map((link) => ({
            userId: link.parentId,
            type: 'ABSENCE',
            message: 'A new absence has been recorded.'
          }))
        })
      }
    }

    return res.status(201).json({ success: true, data: record, message: 'Attendance saved.' })
  } catch (error) {
    return res.status(500).json({ message: 'Error marking attendance.', error: error.message })
  }
}

exports.getStudentAttendance = async (req, res) => {
  try {
    const studentId = Number.parseInt(req.params.studentId, 10)
    const records = await prisma.attendance.findMany({
      where: { studentId },
      orderBy: { date: 'desc' }
    })
    return res.json({ success: true, data: records })
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching attendance.', error: error.message })
  }
}

exports.justifyAbsence = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10)
    const { justification } = req.body

    const updated = await prisma.attendance.update({
      where: { id },
      data: { justification }
    })

    await createAuditLog({
      actorId: req.user?.id,
      action: 'ATTENDANCE_JUSTIFY',
      entityType: 'Attendance',
      entityId: updated.id,
      after: {
        justification: updated.justification
      }
    })

    return res.json({ success: true, data: updated, message: 'Absence justification saved.' })
  } catch (error) {
    return res.status(500).json({ message: 'Error updating absence.', error: error.message })
  }
}
