const express = require('express')
const router = express.Router()
const { protect, authorize } = require('../middlewares/auth.middleware')
const { listUsers, updateUserRole } = require('../controllers/user.controller')

router.get('/', protect, authorize('ADMIN'), listUsers)
router.patch('/:id/role', protect, authorize('ADMIN'), updateUserRole)

module.exports = router
