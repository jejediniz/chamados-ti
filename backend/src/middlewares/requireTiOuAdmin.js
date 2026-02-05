const AppError = require('../utils/AppError')

function requireTiOuAdmin(req, res, next) {
  if (!req.user) {
    return next(new AppError('Acesso não autorizado', 401))
  }

  if (req.user.tipo !== 'ti' && req.user.admin !== true) {
    return next(
      new AppError('Acesso permitido apenas para técnicos ou administradores', 403)
    )
  }

  return next()
}

module.exports = requireTiOuAdmin
