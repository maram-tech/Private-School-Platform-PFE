const express = require('express')
const router = express.Router()
const messageController = require('../controllers/message.controller')
const { protect, authorize } = require('../middlewares/auth.middleware')

router.get('/inbox', protect, authorize('ADMIN', 'TEACHER', 'PARENT'), messageController.getInbox)
router.post('/', protect, authorize('ADMIN', 'TEACHER', 'PARENT'), messageController.sendMessage)

module.exports = router
