const shuffleSeed = require('shuffle-seed')

const { documents } = require('./data.json')

module.exports = (app) => {
  app.get(
    '/full-page-examples/news-and-communications',
    (request, response) => {
      let { order, brexit, organisation } = request.query
      if (!order) {
        order = 'most-viewed'
      }

      // Shuffle the documents based on the query string, to simulate different responses.
      const seed = order + brexit + organisation
      const shuffledDocuments = shuffleSeed.shuffle(documents, seed)

      const total = '128124'
      // Shuffle the total based on the query string
      const randomizedTotal = shuffleSeed.shuffle(total.split(''), seed).join('')
      // Make the total more readable
      const formattedTotal = randomizedTotal.substring(0, 3) + ',' + randomizedTotal.substring(3)

      response.render('./full-page-examples/news-and-communications/index', {
        total: formattedTotal,
        documents: shuffledDocuments,
        order,
        brexit,
        values: request.query // In production this should sanitized.
      })
    }
  )
}
