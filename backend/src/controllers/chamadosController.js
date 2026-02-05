const chamadosService = require('../services/chamadosService')
const asyncHandler = require('../utils/asyncHandler')
const AppError = require('../utils/AppError')
const { sendSuccess, sendCreated, sendNoContent } = require('../utils/response')

exports.create = asyncHandler(async (req, res) => {
  const usuarioId = req.user.id
  const chamado = await chamadosService.create(req.body, usuarioId)
  return sendCreated(res, chamado, 'Chamado criado com sucesso')
})

exports.list = asyncHandler(async (req, res) => {
  const usuarioId = req.user.id
  const listarTodos = req.user.tipo === 'ti' || req.user.admin === true
  const { items, meta } = await chamadosService.list(usuarioId, {
    listarTodos,
    filtros: req.query
  })
  return sendSuccess(res, items, 'Chamados listados com sucesso', meta)
})

exports.findById = asyncHandler(async (req, res) => {
  const usuarioId = req.user.id
  const buscarQualquer = req.user.tipo === 'ti' || req.user.admin === true
  const chamado = await chamadosService.findById(req.params.id, usuarioId, { buscarQualquer })

  if (!chamado) {
    throw new AppError('Chamado não encontrado', 404)
  }

  return sendSuccess(res, chamado, 'Chamado encontrado')
})

exports.update = asyncHandler(async (req, res) => {
  const usuarioId = req.user.id
  const atualizarQualquer = req.user.tipo === 'ti'
  const podeAtribuir = req.user.tipo === 'ti' || req.user.admin === true
  const chamado = await chamadosService.update(
    req.params.id,
    req.body,
    usuarioId,
    { atualizarQualquer, podeAtribuir }
  )

  if (!chamado) {
    throw new AppError('Chamado não encontrado', 404)
  }

  return sendSuccess(res, chamado, 'Chamado atualizado com sucesso')
})

exports.remove = asyncHandler(async (req, res) => {
  const usuarioId = req.user.id
  const deletarQualquer = req.user.admin === true
  const removido = await chamadosService.remove(req.params.id, usuarioId, { deletarQualquer })

  if (!removido) {
    throw new AppError('Chamado não encontrado', 404)
  }

  return sendNoContent(res)
})
