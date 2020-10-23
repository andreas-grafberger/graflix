const fuzz = require('fuzzball')
const _ = require('lodash')

const movieService = require('../movies/movieService')

const MIN_FUZZ_RATIO_NAME = 80
const MIN_FUZZ_RATIO_DESCRIPTION = 80
const MIN_FUZZ_RATIO_GENRE = 90

function matchByName (term, name) {
  const matchRatio = fuzz.partial_ratio(term, name)
  return matchRatio >= MIN_FUZZ_RATIO_NAME
}

function matchByDescription (term, description) {
  const matchRatio = fuzz.token_set_ratio(term, description)
  return matchRatio >= MIN_FUZZ_RATIO_DESCRIPTION
}

function matchByGenres (term, genres) {
  if (!genres || !genres.length) return false
  const matchRatio = fuzz.partial_ratio(term, genres.join(' '))
  return matchRatio >= MIN_FUZZ_RATIO_GENRE
}

function searchMovies (term, movies) {
  const [matchesByName, nonMatchesByName] = _.partition(movies, ({ name }) => matchByName(term, name))
  const [matchesByDescription, nonMatchesByDescription] = _.partition(nonMatchesByName, ({ description }) => matchByDescription(term, description))
  const matchesByGenre = nonMatchesByDescription.filter(({ genres }) => matchByGenres(term, genres))
  return matchesByName.concat(matchesByDescription).concat(matchesByGenre)
}

async function search (searchTerm) {
  const movies = await movieService.getMovies()
  if (!movies) return null
  return searchMovies(searchTerm, movies)
}

module.exports = {
  search
}
