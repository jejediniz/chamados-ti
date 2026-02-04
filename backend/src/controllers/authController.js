const authService = require('../services/authService')

async function register(req, res) {
  try {
    const user = await authService.registrar(req.body)
    res.status(201).json(user)
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ erro: 'Email já cadastrado' })
    }
    res.status(500).json({ erro: 'Erro interno' })
  }
}

async function login(req, res) {
  try {
    const result = await authService.login(req.body)
    res.json(result)
  } catch (err) {
    res.status(401).json({ erro: 'Email ou senha inválidos' })
  }
}

module.exports = { register, login }
