import express from 'express'
import { body, matchedData, validationResult } from 'express-validator'

import { formatValidationErrors } from '../../../utils.mjs'

const router = express.Router()

router.post(
  '/what-is-your-nationality',

  body('confirm-nationality')
    .if(body('other-nationality').not().equals('yes'))
    .if(body('details-cannot-provide-nationality').isEmpty())
    .notEmpty()
    .withMessage('Select your nationality or nationalities'),

  body('country-name')
    .if(body('other-nationality').equals('yes'))
    .notEmpty()
    .withMessage('Enter your country'),

  body('details-cannot-provide-nationality'),
  body('other-nationality'),

  (req, res) => {
    const { example } = res.locals

    const viewPath = `./full-page-examples/${example.path}`
    const errors = formatValidationErrors(validationResult(req))

    if (!errors) {
      return res.redirect(303, `./${example.path}/confirm`)
    }

    res.render(`${viewPath}/index`, {
      errors,
      errorSummary: Object.values(errors),
      values: matchedData(req, { onlyValidData: false }) // In production this should sanitized.
    })
  }
)

export default router
