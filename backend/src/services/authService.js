const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../config/database')

async function registrar({ nome, email, senha }) {
  const senha_hash = await bcrypt.hash(senha, 10)

  const query = `
    INSERT INTO usuarios (nome, email, senha_hash)
    VALUES ($1, $2, $3)
    RETURNING id, nome, email
  `
  const values = [nome, email, senha_hash]

  const { rows } = await pool.query(query, values)
  return rows[0]
}

async function login({ email, senha }) {
  const query = `
    SELECT id, nome, email, senha_hash
    FROM usuarios
    WHERE email = $1 AND ativo = true
  `
  const { rows } = await pool.query(query, [email])

  if (rows.length === 0) {
    throw new Error('Credenciais inválidas')
  }

  const usuario = rows[0]
  const senhaValida = await bcrypt.compare(senha, usuario.senha_hash)

  if (!senhaValida) {
    throw new Error('Credenciais inválidas')
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    }
  }
}

module.exports = { registrar, login }
