export const fetchMovies = async function () {
  return fetch('/api/movies').then(data => data.json())
}
