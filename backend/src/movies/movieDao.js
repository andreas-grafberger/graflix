const db = require('../db')
const { IntegrityConstraintViolationNumbers } = require('../db/errorCodes')

async function getAll () {
  const movies = await db
    .query('SELECT * FROM movies')
    .then(result => result.rows)
  const genres = await db
    .query('SELECT * FROM movie_genre')
    .then(result => result.rows)
  return movies.map(movie => {
    const genresForMovie = genres
      .filter(genre => genre.movie_id === movie.id)
      .map(genre => genre.genre)
    return {
      ...movie,
      genres: genresForMovie
    }
  })
}

async function getGenres () {
  const genres = await db
    .query('SELECT DISTINCT genre FROM movie_genre')
    .then(result => result.rows)
  return genres.map(row => row.genre)
}

async function findById (id) {
  const movie = await db
    .query(
      `SELECT * FROM movies 
      WHERE id = $1
      LIMIT 1`, [id])
    .then(result => result.rows)
    .then(rows => rows.pop() || null)
  if (movie && movie.id) {
    const genres = await db
      .query(
         `SELECT genre FROM movie_genre
         WHERE movie_id = $1
         LIMIT 1`, [movie.id])
      .then(result => result.rows)
      .then(rows => rows.map(row => row.genre))
    return {
      ...movie,
      genres
    }
  }
  return movie
}

async function findByName (name) {
  const movie = await db
    .query(
      `SELECT * FROM movies 
      WHERE name = $1
      LIMIT 1`, [name])
    .then(result => result.rows)
    .then(rows => rows.pop() || null)
  if (movie && movie.id) {
    const genres = await db
      .query(
         `SELECT genre FROM movie_genre
         WHERE movie_id = $1
         LIMIT 1`, [movie.id])
      .then(result => result.rows)
      .then(rows => rows.map(row => row.genre))
    return {
      ...movie,
      genres
    }
  }
  return movie
}

async function save (movie) {
  const { name, year, posterUrl, imdbId, description, length, genres = [] } = movie

  const client = await db.connect()
  try {
    await client.query('BEGIN')

    const res = await client.query(
        `INSERT INTO movies (name, year, posterUrl, imdbId, description, length)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [name, year, posterUrl, imdbId, description, length]
    )

    await Promise.all(genres.map(async genre => {
      return await client.query('INSERT INTO movie_genre(movie_id, genre) VALUES ($1, $2)', [res.rows[0].id, genre])
    }))
    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    if (err.code && err.code.startsWith(IntegrityConstraintViolationNumbers)) {
      return null
    } else {
      throw err
    }
  } finally {
    client.release()
  }
  return movie // TODO: Fetch actual one from db?
}

async function remove (id) {
  const client = await db.connect()
  try {
    await client.query('BEGIN')
    await client.query('DELETE FROM movie_genre WHERE movie_id = $1 RETURNING *', [id])
    await client.query('DELETE FROM movies WHERE id = $1 RETURNING *', [id])
    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
  return true
}

async function removeAll () {
  const client = await db.connect()
  try {
    await client.query('BEGIN')
    await client.query('DELETE FROM movie_genre RETURNING *')
    await client.query('DELETE FROM movies RETURNING *')
    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
  return true
}

async function getWatchInfoForUser (movieName, userId) {
  const movie = await db
    .query(
      `SELECT * FROM movies 
      WHERE name = $1
      LIMIT 1`, [movieName])
    .then(result => result.rows)
    .then(rows => rows.pop() || null)
  if (movie && movie.id) {
    return await db
      .query(
         `SELECT * FROM user_movie
         WHERE movie_id = $1 
         AND user_id = $2`, [movie.id, userId])
      .then(result => result.rows)
      .then(rows => rows.pop() || null)
  }
  return movie
}

async function setWatchTimeForUser (movieName, userId, secondsWatched) {
  const movie = await db
    .query(
      `SELECT * FROM movies 
      WHERE name = $1
      LIMIT 1`, [movieName])
    .then(result => result.rows)
    .then(rows => rows.pop() || null)
  if (movie && movie.id) {
    return await db
      .query(
        `INSERT INTO user_movie (movie_id, user_id, seconds_watched)
        VALUES ($1, $2, $3)
        ON CONFLICT (movie_id, user_id)
          DO 
          UPDATE SET seconds_watched = $3
       RETURNING *`, [movie.id, userId, secondsWatched])
      .then(result => result.rows)
      .then(rows => rows.pop() || null)
  }
  return movie
}

async function addToWatchList (movieId, userId) {
  return await db
    .query(
      `INSERT INTO user_movie (movie_id, user_id, added)
      VALUES ($1, $2, true)
      ON CONFLICT (movie_id, user_id)
        DO 
        UPDATE SET added = true
     RETURNING *`, [movieId, userId])
    .then(result => result.rows)
    .then(rows => rows.pop() || null)
}

async function removeFromWatchList (movieId, userId) {
  return await db
    .query(
      `INSERT INTO user_movie (movie_id, user_id, added)
      VALUES ($1, $2, false)
      ON CONFLICT (movie_id, user_id)
        DO 
        UPDATE SET added = false
     RETURNING *`, [movieId, userId])
    .then(result => result.rows)
    .then(rows => rows.pop() || null)
}

async function getMoviesInWatchList (userId) {
  return await db
    .query(
      `SELECT movies.* 
       FROM movies 
       LEFT JOIN user_movie ON id = movie_id
       WHERE user_id = $1 AND added = true`, [userId])
    .then(result => result.rows)
}

module.exports = {
  getAll,
  findById,
  findByName,
  save,
  remove,
  removeAll,
  getGenres,
  getWatchInfoForUser,
  setWatchTimeForUser,
  addToWatchList,
  removeFromWatchList,
  getMoviesInWatchList
}
