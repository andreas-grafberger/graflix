const app = require('./app')

const port = process.env.BACKEND_PORT || 3000

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
