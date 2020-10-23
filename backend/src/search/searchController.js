const searchService = require('./searchService')

async function search (req, res) {
  const searchTerm = req.params.term
  const searchResult = await searchService.search(searchTerm)
  if (searchResult) {
    res.status(200).json(searchResult)
  } else {
    res.status(400).send()
  }
}

module.exports = {
  search
}
