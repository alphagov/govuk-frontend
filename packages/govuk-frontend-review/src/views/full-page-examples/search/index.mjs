import { readFileSync } from 'fs'
import { join } from 'path'

import { paths } from '@govuk-frontend/config'
import express from 'express'
import { matchedData, query, validationResult } from 'express-validator'
import shuffleSeed from 'shuffle-seed'

import { formatValidationErrors } from '../../../utils.mjs'

const { documents } = JSON.parse(
  readFileSync(
    join(paths.app, 'src/views/full-page-examples/search/data.json'),
    'utf8'
  )
)

const router = express.Router()

router.get(
  '/search',

  query('search').default('driving'),
  query('order').default('most-viewed'),
  query('organisation').toArray(),

  (req, res) => {
    const errors = formatValidationErrors(validationResult(req))

    // Shuffle the documents based on the query string, to simulate different responses.
    const seed = JSON.stringify(req.query)
    const shuffledDocuments = shuffleSeed.shuffle(documents, seed)

    const total = '128124'

    // Shuffle the total based on the query string
    const randomizedTotal = shuffleSeed.shuffle(total.split(''), seed).join('')

    res.render('./full-page-examples/search/index', {
      documents: shuffledDocuments,

      // Make the total more readable
      total: Number(randomizedTotal).toLocaleString('en', {
        useGrouping: true
      }),

      errors,
      errorSummary: Object.values(errors),
      values: matchedData(req, { onlyValidData: false }) // In production this should sanitized.
    })
  }
)

export default router
