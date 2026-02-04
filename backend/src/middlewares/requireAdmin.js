function requireAdmin(req, res, next) {
  if (!req.user || req.user.admin !== true) {
    return res.status(403).json({ erro: 'Acesso permitido apenas para administradores' })
  }

  return next()
}

module.exports = requireAdmin
