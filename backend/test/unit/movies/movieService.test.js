const { movieService, movieDao } = require('../../../src/movies')

jest.mock('../../../src/movies/movieDao')

describe('movieService', () => {
  describe('getAll', () => {
    test('return list of movies', () => {
      const movies = [{ name: 'Avatar', year: 1997 }]

      movieDao.getAll.mockResolvedValue(movies)

      return expect(movieService.getMovies()).resolves.toEqual(movies)
    })

    test('return empty array when db empty', () => {
      const movies = []
      movieDao.getAll.mockResolvedValue(movies)
      return expect(movieService.getMovies()).resolves.toEqual(movies)
    })
  })

  describe('findById', () => {
    test('find a movie by id', () => {
      const movie = { id: 2, name: 'Avatar', year: 1997 }
      movieDao.findById = jest.fn().mockImplementation((id) => Promise.resolve(movie))
      return expect(movieService.getMovieById(2)).resolves.toEqual(movie)
    })

    test('return null if searched movie does not exist', () => {
      movieDao.findById = jest.fn().mockImplementation((id) => null)
      return expect(movieService.getMovieById(2)).resolves.toEqual(null)
    })

    test('fails when the database throws an error', () => {
      movieDao.findById.mockImplementation((id) => {
        throw new Error()
      })
      return expect(movieService.getMovieById(2)).rejects.toThrow()
    })
  })

  describe('create', () => {
    test('create new movie successfully', () => {
      const movie = { name: 'Avatar', year: 1997 }
      const movieReturnedByDao = { id: 42, ...movie }
      movieDao.save = jest.fn().mockImplementation((newMovie) => Promise.resolve(movieReturnedByDao))
      return expect(movieService.createMovie(movie)).resolves.toEqual(movieReturnedByDao)
    })
    test('does not create movie if no name is supplied', () => {
      const movie = { year: 1997 }
      movieDao.save = jest.fn().mockImplementation((newMovie) => Promise.resolve(null))
      return expect(movieService.createMovie(movie)).resolves.toEqual(null)
    })
    test('fail when the database throws an error', () => {
      const movie = { name: 'Avatar', year: 1997 }
      movieDao.save.mockImplementation((newMovie) => {
        throw new Error()
      })
      return expect(movieService.createMovie(movie)).rejects.toThrow()
    })
  })
  describe('delete should', () => {
    test('delete movie successfully', () => {
      const movie = { id: 42, name: 'Avatar', year: 1997 }
      movieDao.remove = jest.fn().mockImplementation((id) => Promise.resolve(movie))
      return expect(movieService.deleteMovie(42)).resolves.toBe(movie)
    })
    test('return null if movie could not be deleted due to e.g. an invalid id', () => {
      movieDao.remove = jest.fn().mockImplementation((id) => Promise.resolve(null))
      return expect(movieService.deleteMovie(42)).resolves.toBe(null)
    })
    test('fail when the database throws an error', () => {
      movieDao.remove.mockImplementation((id) => {
        throw new Error()
      })
      return expect(movieService.deleteMovie(42)).rejects.toThrow()
    })
  })
})
