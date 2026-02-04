const bcrypt = require('bcrypt')
const pool = require('../config/database')

exports.list = async () => {
  const result = await pool.query(
    'SELECT id, nome, email, tipo, admin, ativo FROM usuarios ORDER BY id DESC'
  )
  return result.rows
}

exports.findById = async (id) => {
  const result = await pool.query(
    'SELECT id, nome, email, tipo, admin, ativo FROM usuarios WHERE id = $1',
    [id]
  )
  return result.rows[0]
}

const TIPOS_VALIDOS = ['comum', 'ti']

exports.create = async ({ nome, email, senha, tipo, admin, ativo }) => {
  if (!nome || !email || !senha) {
    throw new Error('Nome, email e senha são obrigatórios')
  }

  if (tipo && !TIPOS_VALIDOS.includes(tipo)) {
    throw new Error('Tipo de usuário inválido')
  }

  if (admin !== undefined && typeof admin !== 'boolean') {
    throw new Error('Admin deve ser boolean')
  }

  if (ativo !== undefined && typeof ativo !== 'boolean') {
    throw new Error('Ativo deve ser boolean')
  }

  const existente = await pool.query('SELECT id FROM usuarios WHERE email = $1', [
    email
  ])

  if (existente.rows.length > 0) {
    throw new Error('Email já cadastrado')
  }

  const senha_hash = await bcrypt.hash(senha, 10)

  const result = await pool.query(
    'INSERT INTO usuarios (nome, email, senha_hash, tipo, admin, ativo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, nome, email, tipo, admin, ativo',
    [nome, email, senha_hash, tipo ?? 'comum', admin ?? false, ativo ?? true]
  )

  return result.rows[0]
}

exports.update = async (id, { nome, email, senha, tipo, admin, ativo }) => {
  let senha_hash = null

  if (senha) {
    senha_hash = await bcrypt.hash(senha, 10)
  }

  if (tipo && !TIPOS_VALIDOS.includes(tipo)) {
    throw new Error('Tipo de usuário inválido')
  }

  if (admin !== undefined && typeof admin !== 'boolean') {
    throw new Error('Admin deve ser boolean')
  }

  if (ativo !== undefined && typeof ativo !== 'boolean') {
    throw new Error('Ativo deve ser boolean')
  }

  const result = await pool.query(
    `
    UPDATE usuarios
    SET
      nome = COALESCE($1, nome),
      email = COALESCE($2, email),
      senha_hash = COALESCE($3, senha_hash),
      tipo = COALESCE($4, tipo),
      admin = COALESCE($5, admin),
      ativo = COALESCE($6, ativo)
    WHERE id = $7
    RETURNING id, nome, email, tipo, admin, ativo
    `,
    [nome ?? null, email ?? null, senha_hash, tipo ?? null, admin ?? null, ativo ?? null, id]
  )

  return result.rows[0]
}

exports.remove = async (id) => {
  const result = await pool.query(
    'DELETE FROM usuarios WHERE id = $1 RETURNING id',
    [id]
  )

  return result.rows[0]
}
