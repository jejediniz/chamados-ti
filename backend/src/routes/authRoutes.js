const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')
const requireAdmin = require('../middlewares/requireAdmin')
const { validateBody } = require('../middlewares/validate')
const { registerSchema, loginSchema } = require('../validators/authSchemas')

router.post('/register', authMiddleware, requireAdmin, validateBody(registerSchema), authController.register)
router.post('/login', validateBody(loginSchema), authController.login)

module.exports = router
