const request = require('supertest')
const { movieService } = require('../../../src/movies')
const authService = require('../../../src/auth/authService')

const app = require('../../../src/app')

jest.mock('../../../src/movies/movieService')
jest.mock('../../../src/auth/authService')

authService.userFromToken.mockResolvedValue({
  name: 'Andreas',
  email: 'test@test.com'
})

describe('/movies should', () => {
  test('200 and return the movies returned by the movieService', async (done) => {
    const movies = [{ name: 'Avatar', year: 1997 }, { name: 'Kundun', year: 1997 }]
    movieService.getMovies.mockResolvedValue(movies)

    const res = await request(app).get('/movies')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(movies)
    done()
    // expect(res.body).toHaveProperty('post')
  })
  test('200 and return the movies returned by the movieService', async (done) => {
    const movie = { id: 42, name: 'Kundun', year: 1997 }
    movieService.getMovieById.mockResolvedValue(movie)

    const res = await request(app).get('/movies/42')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(movie)
    done()
    // expect(res.body).toHaveProperty('post')
  })
})
