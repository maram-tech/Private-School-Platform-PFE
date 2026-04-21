const prisma = require('../prisma')
const { createAuditLog } = require('./audit.controller')

exports.getAnnouncements = async (_req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({
      include: { createdBy: { select: { id: true, name: true, role: true } } },
      orderBy: { createdAt: 'desc' }
    })
    return res.json({ success: true, data: announcements })
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching announcements.', error: error.message })
  }
}

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content } = req.body
    if (!title || !content) {
      return res.status(400).json({ message: 'Please provide title and content.' })
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        createdById: req.user?.id
      }
    })

    await createAuditLog({
      actorId: req.user?.id,
      action: 'ANNOUNCEMENT_CREATE',
      entityType: 'Announcement',
      entityId: announcement.id,
      after: {
        title: announcement.title,
        emergency: String(announcement.title || '').toUpperCase().includes('[EMERGENCY]')
      }
    })

    const users = await prisma.user.findMany({ select: { id: true } })
    if (users.length > 0) {
      await prisma.notification.createMany({
        data: users.map((u) => ({
          userId: u.id,
          type: 'ANNOUNCEMENT',
          message: `New announcement: ${title}`
        }))
      })
    }

    return res.status(201).json({ success: true, data: announcement, message: 'Announcement published.' })
  } catch (error) {
    return res.status(500).json({ message: 'Error creating announcement.', error: error.message })
  }
}
