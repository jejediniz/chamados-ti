const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const requireAdmin = require('../middlewares/requireAdmin')
const userController = require('../controllers/userController')

router.get('/me', authMiddleware, (req, res) => {
  res.json({
    mensagem: 'Acesso autorizado',
    usuario: req.user
  })
})

router.get('/', authMiddleware, requireAdmin, userController.list)
router.get('/:id', authMiddleware, requireAdmin, userController.findById)
router.post('/', authMiddleware, requireAdmin, userController.create)
router.put('/:id', authMiddleware, requireAdmin, userController.update)
router.delete('/:id', authMiddleware, requireAdmin, userController.remove)

module.exports = router
