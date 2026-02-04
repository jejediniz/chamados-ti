const express = require('express')
const router = express.Router()

const chamadosController = require('../controllers/chamadosController')
const authMiddleware = require('../middlewares/authMiddleware')

router.use(authMiddleware)

router.post('/', chamadosController.create)
router.get('/', chamadosController.list)
router.get('/:id', chamadosController.findById)
router.put('/:id', chamadosController.update)
router.delete('/:id', chamadosController.remove)

module.exports = router
