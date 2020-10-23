const db = require('../db')
const { IntegrityConstraintViolationNumbers } = require('../db/errorCodes')

async function getAll () {
  const users = await db
    .query('SELECT name, email FROM users')
    .then(result => result.rows)
  return users
}

async function findByEmail (email) {
  const user = await db
    .query(
      `SELECT id, name, email FROM users 
      WHERE email = $1
      LIMIT 1`, [email])
    .then(result => result.rows)
    .then(rows => rows.pop() || null)
  return user
}

async function findWithPasswordByEmail (email) {
  const user = await db
    .query(
      `SELECT * FROM users 
      WHERE email = $1
      LIMIT 1`, [email])
    .then(result => result.rows)
    .then(rows => rows.pop() || null)
  return user
}

async function save (user) {
  const { name, email, password } = user
  try {
    const insertedUser = await db
      .query(
        `INSERT INTO users (name, email, password) 
      VALUES ($1, $2, $3) 
      RETURNING name, email`, [name, email, password])
      .then(result => result.rows)
      .then(rows => { return rows.pop() || null })
    return insertedUser
  } catch (err) {
    if (err.code && err.code.startsWith(IntegrityConstraintViolationNumbers)) {
      return null
    } else {
      throw err
    }
  }
}

async function remove (id) {
  return await db
    .query('DELETE FROM users WHERE email = $1 RETURNING name, email', [id])
    .then(result => result.rows)
    .then(rows => { return rows.pop() || null })
}

async function removeAll () {
  return await db
    .query('DELETE FROM users RETURNING name, email')
    .then(result => result.rows)
}

module.exports = {
  getAll,
  findByEmail,
  save,
  remove,
  findWithPasswordByEmail,
  removeAll
}
