const crawlerService = require('./crawlerService')

async function crawlMovies (req, res) {
  try {
    const numMoviesAdded = await crawlerService.crawlMovies()
    res.status(200).send(`Succesfully added ${numMoviesAdded} movies`)
  } catch (err) {
    res.status(500).send(err.message)
  }
}

module.exports = {
  crawlMovies
}
