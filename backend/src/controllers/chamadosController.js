const chamadosService = require('../services/chamadosService')

exports.create = async (req, res) => {
  try {
    const usuarioId = req.user.id
    const chamado = await chamadosService.create(req.body, usuarioId)
    res.status(201).json(chamado)
  } catch (error) {
    res.status(400).json({ erro: error.message })
  }
}

exports.list = async (req, res) => {
  try {
    const usuarioId = req.user.id
    const listarTodos = req.user.tipo === 'ti' || req.user.admin === true
    const chamados = await chamadosService.list(usuarioId, { listarTodos })
    res.json(chamados)
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar chamados' })
  }
}

exports.findById = async (req, res) => {
  try {
    const usuarioId = req.user.id
    const buscarQualquer = req.user.tipo === 'ti' || req.user.admin === true
    const chamado = await chamadosService.findById(req.params.id, usuarioId, { buscarQualquer })

    if (!chamado) {
      return res.status(404).json({ erro: 'Chamado não encontrado' })
    }

    res.json(chamado)
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar chamado' })
  }
}

exports.update = async (req, res) => {
  try {
    const usuarioId = req.user.id
    const atualizarQualquer = req.user.tipo === 'ti'
    const chamado = await chamadosService.update(
      req.params.id,
      req.body,
      usuarioId,
      { atualizarQualquer }
    )

    if (!chamado) {
      return res.status(404).json({ erro: 'Chamado não encontrado' })
    }

    res.json(chamado)
  } catch (error) {
    res.status(400).json({ erro: error.message })
  }
}

exports.remove = async (req, res) => {
  try {
    const usuarioId = req.user.id
    const deletarQualquer = req.user.admin === true
    const removido = await chamadosService.remove(req.params.id, usuarioId, { deletarQualquer })

    if (!removido) {
      return res.status(404).json({ erro: 'Chamado não encontrado' })
    }

    res.status(204).send()
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao remover chamado' })
  }
}
