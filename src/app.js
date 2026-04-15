const express = require('express')
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Finance API is running' })
})

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/records', require('./routes/record.routes'))
app.use('/api/dashboard', require('./routes/dashboard.routes'))

module.exports = app