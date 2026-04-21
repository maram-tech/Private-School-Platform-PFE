const prisma = require('../prisma')
const { createAuditLog } = require('./audit.controller')

const ALLOWED_ROLES = ['ADMIN', 'TEACHER', 'PARENT', 'STUDENT']

const listUsers = async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { id: 'asc' }
    })

    return res.status(200).json({ users })
  } catch (error) {
    console.error('List users error:', error)
    return res.status(500).json({ message: 'Server error.' })
  }
}

const updateUserRole = async (req, res) => {
  try {
    const userId = Number.parseInt(req.params.id, 10)
    const { role } = req.body

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ message: 'Invalid user id.' })
    }

    if (!role || !ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        message: `Invalid role. Allowed roles: ${ALLOWED_ROLES.join(', ')}`
      })
    }

    const existingUser = await prisma.user.findUnique({ where: { id: userId } })
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    })

    await createAuditLog({
      actorId: req.user?.id,
      action: 'USER_ROLE_UPDATE',
      entityType: 'User',
      entityId: updatedUser.id,
      before: { role: existingUser.role },
      after: { role: updatedUser.role }
    })

    return res.status(200).json({
      message: 'User role updated successfully.',
      user: updatedUser
    })
  } catch (error) {
    console.error('Update user role error:', error)
    return res.status(500).json({ message: 'Server error.' })
  }
}

module.exports = { listUsers, updateUserRole }
