const validator = require('validator')

const userDao = require('./userDao')

const MIN_PASSWORD_LENGTH = 8

function validateUserInfo (name, email, password) {
  return validator.isEmail(email) && password.length > MIN_PASSWORD_LENGTH
}

async function getUsers () {
  return await userDao.getAll()
}

async function getUserByEmail (email) {
  return await userDao.findByEmail(email)
}

async function getUserWithPasswordByEmail (email) {
  return await userDao.findWithPasswordByEmail(email)
}

async function createUser (user) {
  if (!(user.email && user.name && user.password)) {
    return null
  }
  return await userDao.save(user)
}

async function deleteUser (email) {
  return await userDao.remove(email)
}

async function deleteAllUsers () {
  return await userDao.removeAll()
}

module.exports = {
  getUsers,
  getUserByEmail,
  getUserWithPasswordByEmail,
  createUser,
  deleteUser,
  deleteAllUsers,
  validateUserInfo
}
