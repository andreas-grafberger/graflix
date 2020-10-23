const authService = require('./authService')
const userService = require('../users/userService')
const { defaultCookieExpirationDurationMilliseconds } = require('../config').auth

async function register (req, res) {
  const { name, email, password } = req.body
  if (!(name && email && password)) res.status(400).json('No body with information')
  try {
    const token = await authService.register(name, email, password)
    const user = await userService.getUserByEmail(email)
    if (token) {
      res.status(200)
        .cookie('jwt',
          token,
          {
            expires: new Date(Date.now() + defaultCookieExpirationDurationMilliseconds),
            httpOnly: true,
            secure: false
          })
        .json(user)
    } else {
      res.status(400).send()
    }
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}

async function login (req, res) {
  const { email, password } = req.body
  if (!(email && password)) res.status(400).json('No body with information')
  try {
    const token = await authService.login(email, password)
    const user = await userService.getUserByEmail(email)
    if (token) {
      res.status(200) // put into cookie
        // secure true only works with https
        .cookie('jwt',
          token,
          {
            expires: new Date(Date.now() + defaultCookieExpirationDurationMilliseconds),
            httpOnly: true,
            secure: false
          })
        .json(user)
    } else {
      res.status(400).send('Could not create token!')
    }
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}

async function user (req, res) {
  const token = req.cookies.jwt
  try {
    const user = await authService.userFromToken(token)
    res
      .status(200)
      .json(user)
  } catch (err) {
    res
      .status(401)
      .send('Not logged in')
  }
}

async function logout (req, res) {
  const token = req.cookies.jwt
  if (token) {
    res.status(200)
      .cookie('jwt', null)
      .send('Logout Successful!')
  } else {
    res.status(304)
      .send('Already logged out')
  }
}

module.exports = {
  register,
  login,
  logout,
  user
}
