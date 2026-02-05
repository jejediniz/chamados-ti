const REQUIRED_ENV = ['JWT_SECRET', 'DB_HOST', 'DB_USER', 'DB_NAME']

function validateEnv() {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key])
  if (missing.length > 0) {
    throw new Error(`Variáveis de ambiente ausentes: ${missing.join(', ')}`)
  }
}

function getEnv() {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 3001,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
    corsOrigin: process.env.CORS_ORIGIN || '',
    db: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    }
  }
}

module.exports = {
  validateEnv,
  getEnv
}
