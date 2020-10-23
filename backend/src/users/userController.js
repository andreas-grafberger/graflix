const userService = require('./userService')

async function getUsers (req, res) {
  const users = await userService.getUsers()
  if (users) {
    res.status(200).json(users)
  } else {
    res.status(400).send()
  }
}

async function getUserByEmail (req, res) {
  try {
    const email = req.params.email
    const user = await userService.getUserByEmail(email)
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404).send()
    }
  } catch (err) {
    res.status(500).send()
  }
}

async function createUser (req, res) {
  try {
    const user = await userService.createUser(req.body)
    if (user) {
      res.status(201).json(user)
    } else {
      res.status(400).send()
    }
  } catch (err) {
    res.status(500).send(err.message)
  }
}

async function deleteUser (req, res) {
  try {
    const email = req.params.email
    const user = await userService.deleteUser(email)
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(400).send()
    }
  } catch (err) {
    res.status(500).send(err.message)
  }
}

async function deleteAllUsers (req, res) {
  const users = await userService.deleteAllUsers()
  if (users) {
    res.status(200).send(users)
  } else {
    res.status(400).send()
  }
}

module.exports = {
  getUsers,
  getUserByEmail,
  createUser,
  deleteUser,
  deleteAllUsers
}
