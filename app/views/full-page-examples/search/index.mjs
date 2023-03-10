import { readFile } from 'fs/promises'

import shuffleSeed from 'shuffle-seed'

const { documents } = JSON.parse(await readFile(new URL('data.json', import.meta.url), 'utf8'))

export default (app) => {
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

      response.render('./full-page-examples/search/index', {
        documents: shuffledDocuments,
        order: query.get('order'),

        // Make the total more readable
        total: Number(randomizedTotal)
          .toLocaleString('en', { useGrouping: true }),

        // In production this should be sanitized
        values: Object.fromEntries(query)
      })
    }
  )
}
