import { readFileSync } from 'fs'
import { join } from 'path'

import { paths } from '@govuk-frontend/config'
import express from 'express'
import shuffleSeed from 'shuffle-seed'

const { documents } = JSON.parse(
  readFileSync(
    join(paths.app, 'src/views/full-page-examples/search/data.json'),
    'utf8'
  )
)

const router = express.Router()

router.get('/search', (req, res) => {
  const { query } = req

  query.search ??= 'driving'
  query.order ??= 'most-viewed'

  // Shuffle the documents based on the query string, to simulate different responses.
  const seed = JSON.stringify(query)
  const shuffledDocuments = shuffleSeed.shuffle(documents, seed)

  const total = '128124'

  // Shuffle the total based on the query string
  const randomizedTotal = shuffleSeed.shuffle(total.split(''), seed).join('')

  res.render('./full-page-examples/search/index', {
    documents: shuffledDocuments,
    order: query.order,

    // Make the total more readable
    total: Number(randomizedTotal).toLocaleString('en', {
      useGrouping: true
    }),

    // In production this should be sanitized
    values: query
  })
})

export default router
