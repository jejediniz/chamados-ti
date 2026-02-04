const userService = require('../services/userService')

exports.list = async (req, res) => {
  try {
    const usuarios = await userService.list()
    res.json(usuarios)
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: 'Erro ao listar usuários' })
  }
}

exports.findById = async (req, res) => {
  try {
    const usuario = await userService.findById(req.params.id)

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' })
    }

    res.json(usuario)
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: 'Erro ao buscar usuário' })
  }
}

exports.create = async (req, res) => {
  try {
    const usuario = await userService.create(req.body)
    res.status(201).json(usuario)
  } catch (error) {
    console.error(error)
    res.status(400).json({ erro: error.message })
  }
}

exports.update = async (req, res) => {
  try {
    const usuario = await userService.update(req.params.id, req.body)

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' })
    }

    res.json(usuario)
  } catch (error) {
    console.error(error)
    res.status(400).json({ erro: error.message })
  }
}

exports.remove = async (req, res) => {
  try {
    const removido = await userService.remove(req.params.id)

    if (!removido) {
      return res.status(404).json({ erro: 'Usuário não encontrado' })
    }

    res.status(204).send()
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: 'Erro ao remover usuário' })
  }
}
