import { fetchMovies } from '@/services/movies'
import store from '@/store'

export const getMovieLists = async function () {
  if (!store.state.movies || store.state.movies.length === 0) {
    const movies = await fetchMovies()
    store.commit('setMovies', movies)
  }

  const genres = await fetch('/api/movies/genres').then(res => res.json())
  const genresShownFirst = ['Komödie', 'Action', 'Drama', 'Krimi'].filter(genre => genres.includes(genre))
  const others = genres.filter(genre => !genresShownFirst.includes(genre))
  const genresToShow = genresShownFirst.concat(others)
  return genresToShow.map(genre => {
    return {
      title: genre,
      movies: store.getters.moviesByGenre(genre)
    }
  })
}

export const getWatchList = async function () {
  const movies = await fetch('/api/movies/watchlist').then(data => data.json())
  if (movies && movies.length > 0) {
    return {
      title: 'Deine Liste',
      movies: movies
    }
  } else {
    return null
  }
}
