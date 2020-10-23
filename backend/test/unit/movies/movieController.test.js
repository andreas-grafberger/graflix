const { movieController, movieService } = require('../../../src/movies')

jest.mock('../../../src/movies/movieService')

const mockRequest = (params) => {
  return params
}

const mockResponse = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.send = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('movieController', () => {
  describe('GET /movies should', () => {
    test('200 when a list of movies is returned', async () => {
      const req = mockRequest()
      const res = mockResponse()
      const movies = [{ name: 'Avatar', year: 1997 }]

      movieService.getMovies.mockResolvedValue(movies)

      await movieController.getMovies(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(movies)
    })

    test('200 even when no empty list of movies is returned', async () => {
      const req = mockRequest()
      const res = mockResponse()
      const movies = []

      movieService.getMovies.mockResolvedValue(movies)

      await movieController.getMovies(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(movies)
    })

    test('400 when the service returns null', async () => {
      const req = mockRequest()
      const res = mockResponse()

      movieService.getMovies.mockResolvedValue(null)

      await movieController.getMovies(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
    })
  })
  describe('GET /movies/:id should', () => {
    test('200 when the service returns a movie', async () => {
      const movie = { id: 42, name: 'Avatar', year: 1997 }
      const req = mockRequest({ params: { id: 42 } })
      const res = mockResponse()

      movieService.getMovieById.mockResolvedValue(movie)

      await movieController.getMovieById(req, res)

      expect(movieService.getMovieById.mock.calls[0][0]).toBe(42)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(movie)
    })

    test('404 when the service returns no movie', async () => {
      const req = mockRequest({ params: { id: 42 } })
      const res = mockResponse()

      movieService.getMovieById.mockResolvedValue(null)

      await movieController.getMovieById(req, res)

      expect(movieService.getMovieById.mock.calls[0][0]).toBe(42)
      expect(res.status).toHaveBeenCalledWith(404)
    })

    test('500 when the service throws an error', async () => {
      const req = mockRequest({ params: { id: 42 } })
      const res = mockResponse()

      movieService.getMovieById.mockImplementation(() => {
        throw new Error('Something failed...')
      })

      await movieController.getMovieById(req, res)

      expect(movieService.getMovieById.mock.calls[0][0]).toBe(42)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  describe('POST /movies should', () => {
    test('201 when the service saves a movie', async () => {
      const movie = { name: 'Avatar', year: 1997 }
      const insertedMovie = { id: 42, name: 'Avatar', year: 1997 }
      const req = mockRequest({ body: movie })
      const res = mockResponse()

      movieService.createMovie.mockResolvedValue(insertedMovie)

      await movieController.createMovie(req, res)

      expect(movieService.createMovie).toHaveBeenCalledWith(movie)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(insertedMovie)
    })

    test('400 when the service could not save the movie', async () => {
      const movie = { year: 1997 }
      const req = mockRequest({ body: movie })
      const res = mockResponse()

      movieService.createMovie.mockResolvedValue(null)

      await movieController.createMovie(req, res)

      expect(movieService.createMovie).toHaveBeenCalledWith(movie)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    test('500 when the service throws an error', async () => {
      const movie = { year: 1997 }
      const req = mockRequest({ body: movie })
      const res = mockResponse()

      movieService.createMovie.mockImplementation((newMovie) => {
        throw new Error('Something failed...')
      })

      await movieController.createMovie(req, res)

      expect(movieService.createMovie).toHaveBeenCalledWith(movie)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  describe('DELETE /movies/:id should', () => {
    test('200 when the service deleted a movie', async () => {
      const movie = { id: 42, name: 'Avatar', year: 1997 }
      const req = mockRequest({ params: { id: 42 } })
      const res = mockResponse()

      movieService.deleteMovie.mockResolvedValue(movie)

      await movieController.deleteMovie(req, res)

      expect(movieService.deleteMovie).toHaveBeenCalledWith(42)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(movie)
    })
    test('400 when the service could not delete a movie', async () => {
      const req = mockRequest({ params: { id: 42 } })
      const res = mockResponse()

      movieService.deleteMovie.mockResolvedValue(null)

      await movieController.deleteMovie(req, res)

      expect(movieService.deleteMovie).toHaveBeenCalledWith(42)
      expect(res.status).toHaveBeenCalledWith(400)
    })
  })
})
