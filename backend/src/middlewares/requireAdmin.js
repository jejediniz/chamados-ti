const AppError = require('../utils/AppError')

function requireAdmin(req, res, next) {
  if (!req.user || req.user.admin !== true) {
    return next(new AppError('Acesso permitido apenas para administradores', 403))
  }

  return next()
}

module.exports = requireAdmin
