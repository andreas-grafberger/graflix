const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const { getVideoDurationInSeconds } = require('get-video-duration')

const MOVIE_DIR = require('../config').fs.movieDir
const allowedFileFormats = ['mp4']

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_LANG = 'de'
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_POSTER_SIZE = 'w500'
const TMDB_GENRES = require('./tmdbGenres')

const movieService = require('../movies/movieService')

const isValidMovieFile = fileName => {
  const fileExtension = path.extname(fileName).substring(1)
  const fileIsNotHidden = fileName.charAt(0) !== '.'
  const fileTypeValid = allowedFileFormats.includes(fileExtension)
  return fileIsNotHidden && fileTypeValid
}

function getAvailableMovieNames () {
  const directoryContent = fs.readdirSync(MOVIE_DIR)
  const validMovieFiles = directoryContent.filter(isValidMovieFile)
  const movieNames = validMovieFiles.map(fileName =>
    path.basename(fileName, path.extname(fileName))
  )
  return movieNames
}

async function filterMoviesNotInDatabase (movieNames) {
  const moviesNotInDatabase = await Promise.all(
    movieNames.map(async function (name) {
      return !(await movieService.getMovieByName(name))
    })
  )
  return movieNames.filter((value, index) => moviesNotInDatabase[index])
}

async function movieFromName (name) {
  const data = await fetch(`${TMDB_BASE_URL}/search/movie?query=${name}&api_key=${TMDB_API_KEY}&language=${TMDB_LANG}`)
    .then(data => data.json())
    .catch(_ => { return { name } })

  const results = data.results
  if (!results || results.length === 0) return { name }

  const firstResult = results[0]

  // Extract meta information
  const imagePath = firstResult.backdrop_path || firstResult.poster_path
  const imdbId = firstResult.id
  const description = firstResult.overview
  const genres = TMDB_GENRES.filter(genre => firstResult && firstResult.genre_ids.includes(genre.id)).map(genre => genre.name)
  const year = Math.round(firstResult.release_date && (new Date(firstResult.release_date)).getFullYear()) || null
  const length = await getVideoDurationInSeconds(path.join(MOVIE_DIR, `${name}.mp4`)).then(duration => Math.round(duration)).catch(_ => null)
  let posterUrl = null
  // Save poster
  if (imagePath) {
    const fsPath = path.join(MOVIE_DIR, 'poster', `${TMDB_POSTER_SIZE}${imagePath.slice(1)}`)
    posterUrl = `/api/static/poster/${TMDB_POSTER_SIZE}${imagePath.slice(1)}`
    if (!fs.existsSync(fsPath)) {
      const tmdbPosterPath = `https://image.tmdb.org/t/p/${TMDB_POSTER_SIZE}${imagePath}`
      await fetch(tmdbPosterPath)
        .then(res => res.buffer())
        .then(buffer => {
          return fs.writeFile(fsPath, buffer, (err) => {
            if (err) {
              console.error(err)
              posterUrl = null
              throw err
            }
          })
        })
        .catch(err => { console.error(err) })
    }
  } else {
    posterUrl = null
  }
  return {
    name,
    year,
    posterUrl,
    imdbId,
    description,
    genres,
    length
  }
}

async function crawlMovies () {
  const movieNames = getAvailableMovieNames()
  const movieNamesNotInDB = await filterMoviesNotInDatabase(movieNames)
  return Promise.allSettled(
    movieNamesNotInDB
      .map(async movieName => { movieFromName(movieName).then(movieService.createMovie) })
  )
    .then(rows => rows.length)
}

module.exports = {
  crawlMovies
}
