import express from 'express'
import { body, matchedData, validationResult } from 'express-validator'

import { formatValidationErrors } from '../../../utils.mjs'

const router = express.Router()

router.post(
  '/what-was-the-last-country-you-visited',

  body('last-visited-country')
    .notEmpty()
    .withMessage('Enter the last country you visited'),

  (req, res) => {
    const viewPath =
      './full-page-examples/what-was-the-last-country-you-visited'
    const errors = formatValidationErrors(validationResult(req))

    if (!errors) {
      return res.render(`${viewPath}/confirm`)
    }

    res.render(`${viewPath}/index`, {
      errors,
      errorSummary: Object.values(errors),
      values: matchedData(req, { onlyValidData: false }) // In production this should sanitized.
    })
  }
)

export default router
