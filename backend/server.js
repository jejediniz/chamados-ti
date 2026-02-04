require('dotenv').config()

const app = require('./src/app')
const pool = require('./src/config/database')

const PORT = process.env.PORT || 3001

pool.query('SELECT NOW()')
  .then(result => {
    console.log('Banco conectado:', result.rows[0])
  })
  .catch(err => {
    console.error('Erro ao conectar no banco:', err)
  })

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`)
})
