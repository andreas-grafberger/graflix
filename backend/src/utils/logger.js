const morgan = require('morgan')
const rfs = require('rotating-file-stream')
const path = require('path')

// create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, '..', '..', 'logs')
})

morgan.token('user-token', function (req, res) {
  const token = (req.cookies && req.cookies.jwt && (req.cookies.jwt !== 'j:null')) ? req.cookies.jwt : 'anonymous'
  return token
})

const logFormat = '[:date[clf]] ":user-token" ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'

module.exports = morgan(logFormat, { stream: accessLogStream })
