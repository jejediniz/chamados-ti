const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const chamadosRoutes = require('./routes/chamados.routes')

const app = express()

app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

// Rotas
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/chamados', chamadosRoutes)

module.exports = app
