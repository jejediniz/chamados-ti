const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const AppError = require('../utils/AppError')
const userRepository = require('../repositories/userRepository')
const { getEnv } = require('../config/env')

const { jwtSecret, jwtExpiresIn } = getEnv()

async function registrar({ nome, email, senha, tipo, admin, ativo }) {
  const existente = await userRepository.findByEmail(email)

  if (existente) {
    throw new AppError('Email já cadastrado', 409)
  }

  const senha_hash = await bcrypt.hash(senha, 10)

  const usuario = await userRepository.create({
    nome,
    email,
    senha_hash,
    tipo: tipo ?? 'comum',
    admin: admin ?? false,
    ativo: ativo ?? true
  })

  const token = jwt.sign(
    {
      id: usuario.id,
      tipo: usuario.tipo,
      admin: usuario.admin
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  )

  return {
    token,
    usuario
  }
}

async function login({ email, senha }) {
  const usuario = await userRepository.findByEmail(email)

  if (!usuario) {
    throw new AppError('Credenciais inválidas', 401)
  }

  if (!usuario.ativo) {
    throw new AppError('Usuário inativo', 403)
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha_hash)

  if (!senhaValida) {
    throw new AppError('Credenciais inválidas', 401)
  }

  const token = jwt.sign(
    {
      id: usuario.id,
      tipo: usuario.tipo,
      admin: usuario.admin
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  )

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
      admin: usuario.admin,
      ativo: usuario.ativo
    }
  }
}

module.exports = { registrar, login }
