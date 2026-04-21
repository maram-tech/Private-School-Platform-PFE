const express = require('express')
const router = express.Router()
const classController = require('../controllers/class.controller')
const { protect, authorize } = require('../middlewares/auth.middleware')

router.get('/', protect, authorize('ADMIN', 'TEACHER', 'STUDENT'), classController.getAllClasses)
router.get('/:id', protect, authorize('ADMIN', 'TEACHER', 'STUDENT'), classController.getClassById)
router.post('/', protect, authorize('ADMIN', 'TEACHER'), classController.createClass)
router.put('/:id/students', protect, authorize('ADMIN', 'TEACHER'), classController.assignStudentsToClass)
router.delete('/:id', protect, authorize('ADMIN'), classController.deleteClass)

module.exports = router
