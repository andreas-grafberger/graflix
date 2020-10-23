const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validateUserInfo, getUserWithPasswordByEmail, createUser, getUserByEmail } = require('../users/userService')

const { saltLength, jwtSecret, defaultTokenExpirationDuration } = require('../config').auth

function createToken (user) {
  return jwt.sign({ email: user.email }, jwtSecret, { expiresIn: defaultTokenExpirationDuration })
}

async function login (email, password) {
  const userAlreadyInDb = await getUserWithPasswordByEmail(email)
  if (!userAlreadyInDb) return null

  const passwordCorrect = bcrypt.compareSync(password, userAlreadyInDb.password)
  if (passwordCorrect) {
    return createToken(userAlreadyInDb)
  } else {
    return null
  }
}

async function register (name, email, password) {
  if (!validateUserInfo(name, email, password)) return null
  const userAlreadyInDb = await getUserWithPasswordByEmail(email)
  if (userAlreadyInDb) return await login(email, password) // User already exists
  const passwordHash = bcrypt.hashSync(password, saltLength) // Also salts hash
  const user = {
    name: name,
    email: email,
    password: passwordHash
  }
  const savedUser = await createUser(user)
  if (!savedUser) return null
  return createToken(savedUser)
}

async function userFromToken (token) {
  if (!token) { return null }

  const decodedToken = jwt.verify(token, jwtSecret)
  const userEmail = decodedToken.email
  return await getUserByEmail(userEmail)
}

module.exports = {
  register,
  login,
  userFromToken
}
