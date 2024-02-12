import express from 'express'
import { matchedData, validationResult } from 'express-validator'

import { formatValidationErrors } from '../../../utils.mjs'

const router = express.Router()

router.post('/check-your-answers', (req, res) => {
  const { example } = res.locals

  const viewPath = `./full-page-examples/${example.path}`
  const errors = formatValidationErrors(validationResult(req))

  if (!errors) {
    return res.render(`${viewPath}/confirm`)
  }

  res.render(`${viewPath}/index`, {
    errors,
    errorSummary: Object.values(errors),
    values: matchedData(req, { onlyValidData: false }) // In production this should sanitized.
  })
})

export default router
