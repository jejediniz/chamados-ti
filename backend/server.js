require('dotenv').config()

const app = require('./src/app')
const pool = require('./src/config/database')
const logger = require('./src/utils/logger')
const { validateEnv, getEnv } = require('./src/config/env')

validateEnv()

const { port } = getEnv()

pool.query('SELECT NOW()')
  .then(result => {
    logger.info('Banco conectado', { timestamp: result.rows[0]?.now })
  })
  .catch(err => {
    logger.error('Erro ao conectar no banco', { message: err.message })
  })

app.listen(port, () => {
  logger.info('API rodando', { port })
})
