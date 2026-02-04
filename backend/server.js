require('dotenv').config()

const express = require('express')
const cors = require('cors')

const pool = require('../backend/database')
const authRoutes = require('./src/routes/authRoutes')

const app = express()

app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

// Rotas
app.use('/auth', authRoutes)

// Teste de conexão com o banco
pool.query('SELECT NOW()')
  .then(result => {
    console.log('Banco conectado:', result.rows[0])
  })
  .catch(err => {
    console.error('Erro ao conectar no banco:', err)
  })

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`)
})
