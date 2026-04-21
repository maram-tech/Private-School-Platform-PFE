const express = require('express')
const router = express.Router()
const courseController = require('../controllers/course.controller')
const { protect, authorize } = require('../middlewares/auth.middleware')

router.get('/', protect, authorize('ADMIN', 'TEACHER', 'STUDENT'), courseController.getAllCourses)
router.post('/', protect, authorize('ADMIN', 'TEACHER'), courseController.createCourse)
router.get('/:courseId/materials', protect, authorize('ADMIN', 'TEACHER', 'STUDENT'), courseController.getCourseMaterials)
router.post('/:courseId/materials', protect, authorize('ADMIN', 'TEACHER'), courseController.addCourseMaterial)

module.exports = router
