const shuffleSeed = require('shuffle-seed')

const { documents } = require('./data.json')

module.exports = (app) => {
  app.get(
    '/full-page-examples/news-and-communications',
    (request, response) => {
      let { order, brexit } = request.query

      let errors = {}
      if (order === 'default' && !brexit) {
        errors = {
          'order': {
            href: '#order',
            value: 'default',
            text: 'Select an option'
          }
        }
        // Ensure that the document ordering are the same when no order is selected.
        order = undefined
      }

      // Shuffle the documents based on the query string, to simulate different responses.
      const seed = order + brexit
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
        errors,
        errorSummary: Object.values(errors)
      })
    }
  )
}
