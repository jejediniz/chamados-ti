const AppError = require('../utils/AppError')

function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    })

    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message
      }))

      return next(new AppError('Dados inválidos', 400, details))
    }

    req.body = value
    return next()
  }
}

function validateQuery(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    })

    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message
      }))

      return next(new AppError('Dados inválidos', 400, details))
    }

    req.query = value
    return next()
  }
}

module.exports = {
  validateBody,
  validateQuery
}
