module.exports = (app) => {
  app.get(
    '/full-page-examples/news-and-communications',
    (request, response) => {
      const { order, brexit } = request.query
      let source = 'most-viewed'
      if (
        order === 'most-viewed' ||
        order === 'updated-oldest' ||
        order === 'updated-newest'
      ) {
        source = order
      }
      // If brexit true on forget about the source order, which is OK for a demonstration page.
      if (brexit) {
        source = 'related-to-brexit'
      }
      const { total, documents } = require(`./data/${source}.json`)
      response.render('./full-page-examples/news-and-communications/index', {
        total,
        documents,
        source
      })
    }
  )
}
