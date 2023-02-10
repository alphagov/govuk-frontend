const shuffleSeed = require('shuffle-seed')

const { documents } = require('./data.json')

module.exports = (app) => {
  app.get(
    '/full-page-examples/search',
    (request, response) => {
      const { query } = request

      query.set('search', query.get('search') ?? 'driving')
      query.set('order', query.get('order') ?? 'most-viewed')

      // Shuffle the documents based on the query string, to simulate different responses.
      const seed = query.toString()
      const shuffledDocuments = shuffleSeed.shuffle(documents, seed)

      const total = '128124'
      // Shuffle the total based on the query string
      const randomizedTotal = shuffleSeed.shuffle(total.split(''), seed).join('')
      // Make the total more readable
      const formattedTotal = randomizedTotal.substring(0, 3) + ',' + randomizedTotal.substring(3)

      response.render('./full-page-examples/search/index', {
        total: formattedTotal,
        documents: shuffledDocuments,
        order: query.get('order'),

        // In production this should be sanitized
        values: Object.fromEntries(query)
      })
    }
  )
}
