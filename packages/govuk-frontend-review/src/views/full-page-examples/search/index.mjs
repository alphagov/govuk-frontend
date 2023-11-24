import { readFileSync } from 'fs'
import { join } from 'path'

import { paths } from '@govuk-frontend/config'
import shuffleSeed from 'shuffle-seed'

const { documents } = JSON.parse(
  readFileSync(
    join(paths.app, 'src/views/full-page-examples/search/data.json'),
    'utf8'
  )
)

/**
 * @param {import('express').Application} app
 */
export default (app) => {
  app.get(
    '/full-page-examples/search',

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

      const total = '128124'

      // Shuffle the total based on the query string
      const randomizedTotal = shuffleSeed
        .shuffle(total.split(''), seed)
        .join('')

      response.render('./full-page-examples/search/index', {
        documents: shuffledDocuments,
        order: query.order,

        // Make the total more readable
        total: Number(randomizedTotal).toLocaleString('en', {
          useGrouping: true
        }),

        // In production this should be sanitized
        values: query
      })
    }
  )
}
