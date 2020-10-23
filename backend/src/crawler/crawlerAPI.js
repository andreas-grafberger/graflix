const express = require('express')

const userAuthentication = require('../auth/userMiddleware')
const crawlerController = require('./crawlerController')

const router = express.Router()

router.use(userAuthentication)

router.post('/', crawlerController.crawlMovies)

module.exports = router
