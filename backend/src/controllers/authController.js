const authService = require('../services/authService')
const asyncHandler = require('../utils/asyncHandler')
const { sendSuccess, sendCreated } = require('../utils/response')

exports.register = asyncHandler(async (req, res) => {
  const resultado = await authService.registrar(req.body)
  return sendCreated(res, resultado, 'Usuário registrado com sucesso')
})

exports.login = asyncHandler(async (req, res) => {
  const resultado = await authService.login(req.body)
  return sendSuccess(res, resultado, 'Login realizado com sucesso')
})
