const ChamadoModel = require('../models/chamado.model')

const STATUS_VALIDOS = ['aberto', 'em_andamento', 'fechado']
const PRIORIDADES_VALIDAS = ['baixa', 'media', 'alta']

exports.create = async (dados, usuarioId) => {
  const { titulo, descricao, prioridade } = dados

  if (!titulo || !descricao) {
    throw new Error('Título e descrição são obrigatórios')
  }

  const prioridadeFinal = PRIORIDADES_VALIDAS.includes(prioridade)
    ? prioridade
    : 'media'

  const statusInicial = 'aberto'

  const result = await ChamadoModel.criar(
    {
      titulo,
      descricao,
      prioridade: prioridadeFinal,
      status: statusInicial
    },
    usuarioId
  )

  return result.rows[0]
}

exports.list = async (usuarioId) => {
  const result = await ChamadoModel.listarPorUsuario(usuarioId)
  return result.rows
}

exports.findById = async (id, usuarioId) => {
  const result = await ChamadoModel.buscarPorId(id, usuarioId)
  return result.rows[0] || null
}

exports.update = async (id, dados, usuarioId) => {
  const { status, prioridade } = dados

  if (status && !STATUS_VALIDOS.includes(status)) {
    throw new Error('Status inválido')
  }

  if (prioridade && !PRIORIDADES_VALIDAS.includes(prioridade)) {
    throw new Error('Prioridade inválida')
  }

  const result = await ChamadoModel.atualizar(id, dados, usuarioId)
  return result.rows[0] || null
}

exports.remove = async (id, usuarioId) => {
  const result = await ChamadoModel.deletar(id, usuarioId)
  return result.rowCount > 0
}
