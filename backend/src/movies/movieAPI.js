const express = require('express')

const userAuthentication = require('../auth/userMiddleware')
const movieController = require('./movieController')

const router = express.Router()
const genreRouter = express.Router()
const watchInfoRouter = express.Router()

router.use(userAuthentication)
router.use(genreRouter)
router.use(watchInfoRouter)

router.get('/', movieController.getMovies)
router.post('/', movieController.createMovie)
router.delete('/:id', movieController.deleteMovie)
router.get('/:id', movieController.getMovieById)
router.delete('/', movieController.deleteAllMovies)

genreRouter.get('/genres', movieController.getGenres)

watchInfoRouter.get('/watched/:name', movieController.getWatchInfo)
watchInfoRouter.put('/watched/:name', movieController.setWatchTime)
watchInfoRouter.get('/watchlist', movieController.getWatchList)
watchInfoRouter.post('/watchlist/:id', movieController.addToWatchList)
watchInfoRouter.delete('/watchlist/:id', movieController.removeFromWatchList)

module.exports = router
