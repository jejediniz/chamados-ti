const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/me', authMiddleware, (req, res) => {
  res.json({
    mensagem: 'Acesso autorizado',
    usuario: req.user
  })
})

module.exports = router
