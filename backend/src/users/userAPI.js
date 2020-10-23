const express = require('express')

const userController = require('./userController')

const router = express.Router()

router.get('/', userController.getUsers)
router.post('/', userController.createUser)
router.delete('/:email', userController.deleteUser)
router.get('/:email', userController.getUserByEmail)
router.delete('/', userController.deleteAllUsers)

module.exports = router
