const movieService = require('./movieService')

async function getMovies (req, res) {
  const movies = await movieService.getMovies()
  if (movies) {
    res.status(200).json(movies)
  } else {
    res.status(400).send()
  }
}

async function getGenres (req, res) {
  const genres = await movieService.getGenres()
  if (genres) {
    res.status(200).json(genres)
  } else {
    res.status(400).send()
  }
}

async function getMovieById (req, res) {
  try {
    const id = req.params.id
    const movie = await movieService.getMovieById(id)
    if (movie) {
      res.status(200).json(movie)
    } else {
      res.status(404).send()
    }
  } catch (err) {
    res.status(500).send()
  }
}

async function createMovie (req, res) {
  try {
    const movie = await movieService.createMovie(req.body)
    if (movie) {
      res.status(201).json(movie)
    } else {
      res.status(400).send()
    }
  } catch (err) {
    res.status(500).send(err.message)
  }
}

async function deleteMovie (req, res) {
  try {
    const id = req.params.id
    const movie = await movieService.deleteMovie(id)
    if (movie) {
      res.status(200).json(movie)
    } else {
      res.status(400).send()
    }
  } catch (err) {
    res.status(500).send(err.message)
  }
}

async function deleteAllMovies (req, res) {
  const movies = await movieService.deleteAllMovies()
  if (movies) {
    res.status(200).send(movies)
  } else {
    res.status(400).send()
  }
}

async function getWatchInfo (req, res) {
  if (!req.params.name) {
    res.status(400).send('No movie name given')
  }
  if (!req.user || !req.user.id) {
    res.status(400).send('No user token supplied or user not found')
  }
  const watchInfo = await movieService.getWatchInfo(req.params.name, req.user.id)
  res.status(200).send(watchInfo)
}

async function setWatchTime (req, res) {
  if (!req.params.name) {
    res.status(400).send('No movie name given')
  }
  if (!req.user || !req.user.id) {
    res.status(400).send('No user token supplied or user not found')
  }
  if (!req.query || !req.query.seconds) {
    res.status(400).send('No seconds specified via ?seconds=xxx')
  }
  const watchInfo = await movieService.setWatchTime(
    req.params.name,
    req.user.id,
    req.query.seconds)
  res.status(200).send(watchInfo)
}

async function getWatchList (req, res) {
  const userId = req.user.id
  const watchList = await movieService.getWatchList(userId)
  if (watchList) {
    res.status(200).json(watchList)
  } else {
    res.status(400).send('Watch list could not be fetched. Check if you are logged in.')
  }
}

async function addToWatchList (req, res) {
  const userId = req.user.id
  const movieId = req.params.id
  const addedMovie = await movieService.addToWatchList(movieId, userId)
  if (addedMovie) {
    res.status(200).send('Movie added to watch list')
  } else {
    res.status(400).send('Check if logged in and movie exists')
  }
}

async function removeFromWatchList (req, res) {
  const userId = req.user.id
  const movieId = req.params.id
  const addedMovie = await movieService.removeFromWatchList(movieId, userId)
  if (addedMovie) {
    res.status(200).send('Movie removed from watch list')
  } else {
    res.status(400).send('Check if logged in and movie exists')
  }
}

module.exports = {
  getMovies,
  getMovieById,
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
