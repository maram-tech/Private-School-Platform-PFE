const prisma = require('../prisma')

exports.getInbox = async (req, res) => {
  try {
    const inbox = await prisma.message.findMany({
      where: { recipientId: req.user.id },
      include: {
        sender: { select: { id: true, name: true, role: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return res.json({ success: true, data: inbox })
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching inbox.', error: error.message })
  }
}

exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body

    if (!recipientId || !content) {
      return res.status(400).json({ message: 'Please provide recipientId and content.' })
    }

    const recipient = await prisma.user.findUnique({ where: { id: Number.parseInt(recipientId, 10) } })
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found.' })
    }

    const senderRole = req.user.role
    const recipientRole = recipient.role

    const isTeacherParentDirection =
      (senderRole === 'TEACHER' && recipientRole === 'PARENT') ||
      (senderRole === 'PARENT' && recipientRole === 'TEACHER')

    if (senderRole !== 'ADMIN' && !isTeacherParentDirection) {
      return res.status(403).json({
        message: 'Only teacher-parent messaging is allowed for non-admin users.'
      })
    }

    const msg = await prisma.message.create({
      data: {
        senderId: req.user.id,
        recipientId: Number.parseInt(recipientId, 10),
        content
      }
    })

    await prisma.notification.create({
      data: {
        userId: Number.parseInt(recipientId, 10),
        type: 'MESSAGE',
        message: 'You received a new message.'
      }
    })

    return res.status(201).json({ success: true, data: msg, message: 'Message sent.' })
  } catch (error) {
    return res.status(500).json({ message: 'Error sending message.', error: error.message })
  }
}
