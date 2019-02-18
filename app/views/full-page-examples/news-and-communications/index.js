module.exports = (app) => {
  app.get(
    '/full-page-examples/news-and-communications',
    (request, response) => {
      const { order, brexit } = request.query
      let source = 'most-viewed'
      let errors = {}
      if (
        order === 'most-viewed' ||
        order === 'updated-oldest' ||
        order === 'updated-newest'
      ) {
        source = order
      }
      if (order === 'default' && !brexit) {
        errors = {
          'order': {
            href: '#order',
            value: 'default',
            text: 'Select an option'
          }
        }
      }
      // If brexit true on forget about the source order, which is OK for a demonstration page.
      if (brexit) {
        source = 'related-to-brexit'
      }
      const { total, documents } = require(`./data/${source}.json`)
      response.render('./full-page-examples/news-and-communications/index', {
        total,
        documents,
        order,
        brexit,
        errors,
        errorSummary: Object.values(errors)
      })
    }
  )
}
