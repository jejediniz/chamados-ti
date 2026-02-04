const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')
const requireAdmin = require('../middlewares/requireAdmin')

router.post('/register', authMiddleware, requireAdmin, authController.register)
router.post('/login', authController.login)

module.exports = router
