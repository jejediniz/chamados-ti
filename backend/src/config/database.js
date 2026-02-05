const { Pool } = require('pg')
const { getEnv } = require('./env')

const { db } = getEnv()

const pool = new Pool({
  host: db.host,
  port: db.port,
  user: db.user,
  password: db.password,
  database: db.database
})

module.exports = pool
