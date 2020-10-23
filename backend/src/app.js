const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const logger = require('./utils/logger')

const movieAPI = require('./movies/movieAPI')
const userAPI = require('./users/userAPI')
const authAPI = require('./auth/authAPI')
const crawlerAPI = require('./crawler/crawlerAPI')
const searchAPI = require('./search/searchAPI')

const app = express()

if (process.env.NODE_ENV !== 'test') {
  app.use(logger)
}
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/static', express.static('/mnt/nas/movies'))

// REST endpoints
app.use('/movies', movieAPI)
app.use('/users', userAPI)
app.use('/auth', authAPI)
app.use('/crawl', crawlerAPI)
app.use('/search', searchAPI)

module.exports = app
