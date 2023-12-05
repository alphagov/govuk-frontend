import express from 'express'
import { body, matchedData, validationResult } from 'express-validator'

import { formatValidationErrors } from '../../../utils.mjs'

const router = express.Router()

router.post(
  '/what-is-your-address',

  body('address-line-1')
    .notEmpty()
    .withMessage('Enter your building and street'),

  body('address-line-2').optional(),
  body('address-town').notEmpty().withMessage('Enter your town and city'),
  body('address-county').notEmpty().withMessage('Enter your county'),
  body('address-postcode').notEmpty().withMessage('Enter your postcode'),

  (req, res) => {
    const viewPath = './full-page-examples/what-is-your-address'
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
