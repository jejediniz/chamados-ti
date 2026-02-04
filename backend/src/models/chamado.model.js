const pool = require('../config/database')

const ChamadoModel = {
  criar: (dados, usuarioId) => {
    const query = `
      INSERT INTO chamados (titulo, descricao, status, prioridade, usuario_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `
    return pool.query(query, [
      dados.titulo,
      dados.descricao,
      dados.status,
      dados.prioridade,
      usuarioId
    ])
  },

  listarPorUsuario: (usuarioId) => {
    const query = `
      SELECT *
      FROM chamados
      WHERE usuario_id = $1
      ORDER BY id DESC;
    `
    return pool.query(query, [usuarioId])
  },

  buscarPorId: (id, usuarioId) => {
    const query = `
      SELECT *
      FROM chamados
      WHERE id = $1 AND usuario_id = $2;
    `
    return pool.query(query, [id, usuarioId])
  },

  atualizar: (id, dados, usuarioId) => {
    const query = `
      UPDATE chamados
      SET
        titulo = COALESCE($1, titulo),
        descricao = COALESCE($2, descricao),
        status = COALESCE($3, status),
        prioridade = COALESCE($4, prioridade),
        updated_at = NOW()
      WHERE id = $5 AND usuario_id = $6
      RETURNING *;
    `
    return pool.query(query, [
      dados.titulo,
      dados.descricao,
      dados.status,
      dados.prioridade,
      id,
      usuarioId
    ])
  },

  deletar: (id, usuarioId) => {
    const query = `
      DELETE FROM chamados
      WHERE id = $1 AND usuario_id = $2
      RETURNING id;
    `
    return pool.query(query, [id, usuarioId])
  }
}

module.exports = ChamadoModel
