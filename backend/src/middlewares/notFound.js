const AppError = require('../utils/AppError')

function notFound(req, res, next) {
  next(new AppError('Rota não encontrada', 404))
}

module.exports = notFound
