const { Pool } = require('pg')
const { user, password, database, port, host } = require('../config').database

const pool = new Pool({
  host,
  user,
  password,
  database,
  port
})

module.exports = pool
