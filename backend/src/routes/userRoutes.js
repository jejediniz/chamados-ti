const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const requireAdmin = require('../middlewares/requireAdmin')
const requireTiOuAdmin = require('../middlewares/requireTiOuAdmin')
const userController = require('../controllers/userController')
const { validateBody } = require('../middlewares/validate')
const { createUserSchema, updateUserSchema } = require('../validators/userSchemas')

router.get('/me', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Acesso autorizado',
    data: req.user
  })
})

router.get('/', authMiddleware, requireAdmin, userController.list)
router.get('/tecnicos', authMiddleware, requireTiOuAdmin, userController.listTecnicos)
router.get('/:id', authMiddleware, requireAdmin, userController.findById)
router.post('/', authMiddleware, requireAdmin, validateBody(createUserSchema), userController.create)
router.put('/:id', authMiddleware, requireAdmin, validateBody(updateUserSchema), userController.update)
router.delete('/:id', authMiddleware, requireAdmin, userController.remove)

module.exports = router
