const jwt = require('jsonwebtoken')
const AppError = require('../utils/AppError')
const { getEnv } = require('../config/env')

const { jwtSecret } = getEnv()

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return next(new AppError('Token não informado', 401))
  }

  const [scheme, token] = authHeader.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return next(new AppError('Token inválido', 401))
  }

  try {
    const decoded = jwt.verify(token, jwtSecret)

    if (!decoded.id) {
      return next(new AppError('Token inválido', 401))
    }

    req.user = {
      id: decoded.id,
      tipo: decoded.tipo,
      admin: decoded.admin
    }

    return next()
  } catch (err) {
    return next(new AppError('Token inválido ou expirado', 401))
  }
}

module.exports = authMiddleware
