const movieDao = require('./movieDao')

async function getMovies () {
  return await movieDao.getAll()
}

async function getMovieByName (name) {
  return await movieDao.findByName(name)
}

async function getMovieById (id) {
  return await movieDao.findById(id)
}

async function createMovie (movie) {
  // Check fields
  if (!movie.name) {
    return null
  }
  return await movieDao.save(movie)
}

async function deleteMovie (id) {
  return await movieDao.remove(id)
}

async function deleteAllMovies () {
  return await movieDao.removeAll()
}

async function getGenres () {
  return await movieDao.getGenres()
}

async function getWatchInfo (movieName, userId) {
  const watchInfo = await movieDao.getWatchInfoForUser(movieName, userId)
  return watchInfo || {}
}

async function setWatchTime (movieName, userId, secondsWatched) {
  return await movieDao.setWatchTimeForUser(movieName, userId, secondsWatched)
}

async function getWatchList (userId) {
  return await movieDao.getMoviesInWatchList(userId)
}

async function addToWatchList (movieId, userId) {
  return await movieDao.addToWatchList(movieId, userId)
}

async function removeFromWatchList (movieId, userId) {
  return await movieDao.removeFromWatchList(movieId, userId)
}

module.exports = {
  getMovies,
  getMovieById,
  getMovieByName,
  createMovie,
  deleteMovie,
  deleteAllMovies,
  getGenres,
  getWatchInfo,
  setWatchTime,
  getWatchList,
  addToWatchList,
  removeFromWatchList
}
