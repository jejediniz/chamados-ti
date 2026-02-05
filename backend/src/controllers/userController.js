const userService = require('../services/userService')
const asyncHandler = require('../utils/asyncHandler')
const AppError = require('../utils/AppError')
const { sendSuccess, sendCreated, sendNoContent } = require('../utils/response')

exports.list = asyncHandler(async (req, res) => {
  const usuarios = await userService.list()
  return sendSuccess(res, usuarios, 'Usuários listados com sucesso')
})

exports.listTecnicos = asyncHandler(async (req, res) => {
  const tecnicos = await userService.listTecnicos()
  return sendSuccess(res, tecnicos, 'Técnicos listados com sucesso')
})

exports.findById = asyncHandler(async (req, res) => {
  const usuario = await userService.findById(req.params.id)

  if (!usuario) {
    throw new AppError('Usuário não encontrado', 404)
  }

  return sendSuccess(res, usuario, 'Usuário encontrado')
})

exports.create = asyncHandler(async (req, res) => {
  const usuario = await userService.create(req.body)
  return sendCreated(res, usuario, 'Usuário criado com sucesso')
})

exports.update = asyncHandler(async (req, res) => {
  const usuario = await userService.update(req.params.id, req.body)

  if (!usuario) {
    throw new AppError('Usuário não encontrado', 404)
  }

  return sendSuccess(res, usuario, 'Usuário atualizado com sucesso')
})

exports.remove = asyncHandler(async (req, res) => {
  const removido = await userService.remove(req.params.id)

  if (!removido) {
    throw new AppError('Usuário não encontrado', 404)
  }

  return sendNoContent(res)
})
