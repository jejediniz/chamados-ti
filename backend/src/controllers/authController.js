const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../config/database')

exports.register = async (req, res) => {
  const { nome, email, senha, tipo, admin, ativo } = req.body

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' })
  }

  if (tipo && !['comum', 'ti'].includes(tipo)) {
    return res.status(400).json({ erro: 'Tipo de usuário inválido' })
  }

  if (admin !== undefined && typeof admin !== 'boolean') {
    return res.status(400).json({ erro: 'Admin deve ser boolean' })
  }

  if (ativo !== undefined && typeof ativo !== 'boolean') {
    return res.status(400).json({ erro: 'Ativo deve ser boolean' })
  }

  try {
    const existente = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    )

    if (existente.rows.length > 0) {
      return res.status(409).json({ erro: 'Email já cadastrado' })
    }

    const senha_hash = await bcrypt.hash(senha, 10)

    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, senha_hash, tipo, admin, ativo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, nome, email, tipo, admin, ativo',
      [nome, email, senha_hash, tipo ?? 'comum', admin ?? false, ativo ?? true]
    )

    const usuario = result.rows[0]

    const token = jwt.sign(
      {
        id: usuario.id,
        tipo: usuario.tipo,
        admin: usuario.admin
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.status(201).json({
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        admin: usuario.admin,
        ativo: usuario.ativo
      },
      token
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: 'Erro interno no servidor' })
  }
}

exports.login = async (req, res) => {
  const { email, senha } = req.body

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' })
  }

  try {
    const result = await pool.query(
      'SELECT id, nome, email, senha_hash, tipo, admin, ativo FROM usuarios WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ erro: 'Credenciais inválidas' })
    }

    const usuario = result.rows[0]

    if (!usuario.ativo) {
      return res.status(403).json({ erro: 'Usuário inativo' })
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash)

    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas' })
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        tipo: usuario.tipo,
        admin: usuario.admin
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        admin: usuario.admin
      },
      token
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: 'Erro interno no servidor' })
  }
}
