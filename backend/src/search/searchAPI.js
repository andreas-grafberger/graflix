const express = require('express')

const userAuthentication = require('../auth/userMiddleware')
const searchController = require('./searchController')

const router = express.Router()

router.use(userAuthentication)

router.get('/:term', searchController.search)

module.exports = router
