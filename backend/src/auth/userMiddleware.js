const authService = require('./authService')

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.jwt
    const user = await authService.userFromToken(token)
    if (!user) {
      throw new Error('Invalid User')
    } else {
      req.user = user
      next()
    }
  } catch (err) {
    res.status(401).json({
      error: new Error('Invalid request!')
    })
  }
}
