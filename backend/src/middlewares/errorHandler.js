const AppError = require('../utils/AppError')
const logger = require('../utils/logger')

function errorHandler(err, req, res, _next) {
  const statusCode = err instanceof AppError ? err.statusCode : 500
  const message = err.message || 'Erro interno no servidor'

  if (statusCode >= 500) {
    logger.error('Erro interno', {
      path: req.originalUrl,
      method: req.method,
      statusCode
    })
  }

  const response = {
    success: false,
    error: {
      message
    }
  }

  if (err.details && process.env.NODE_ENV !== 'production') {
    response.error.details = err.details
  }

  res.status(statusCode).json(response)
}

module.exports = errorHandler
