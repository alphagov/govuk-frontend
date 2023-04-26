import { readFile } from 'fs/promises'

import shuffleSeed from 'shuffle-seed'

const { documents } = JSON.parse(await readFile(new URL('data.json', import.meta.url), 'utf8'))

/**
 * @param {import('express').Application} app
 */
export default (app) => {
  app.get(
    '/full-page-examples/search-three-pages',

    /**
     * @param {import('express').Request} request
     * @param {import('express').Response} response
     */
    (request, response) => {
      const { query } = request

      query.search ??= 'driving'
      query.order ??= 'most-viewed'

      // Shuffle the documents based on the query string, to simulate different responses.
      const seed = JSON.stringify(query)
      const shuffledDocuments = shuffleSeed.shuffle(documents, seed)

      const total = '55'

      // Shuffle the total based on the query string
      const randomizedTotal = shuffleSeed.shuffle(total.split(''), seed).join('')

      response.render('./full-page-examples/search-three-pages/index', {
        documents: shuffledDocuments,
        order: query.order,

        // Make the total more readable
        total: Number(randomizedTotal)
          .toLocaleString('en', { useGrouping: true }),

        // In production this should be sanitized
        values: query
      })
    }
  )
}
