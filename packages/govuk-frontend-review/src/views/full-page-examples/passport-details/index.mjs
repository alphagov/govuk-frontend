import express from 'express'
import { body, matchedData, validationResult } from 'express-validator'

import { formatValidationErrors } from '../../../utils.mjs'

const router = express.Router()

router.post(
  '/passport-details',

  body('passport-number')
    .exists()
    .not()
    .isEmpty()
    .withMessage('Enter your passport number'),

  body('expiry-day')
    .exists()
    .not()
    .isEmpty()
    .withMessage('Enter your expiry day'),

  body('expiry-month')
    .exists()
    .not()
    .isEmpty()
    .withMessage('Enter your expiry month'),

  body('expiry-year')
    .exists()
    .not()
    .isEmpty()
    .withMessage('Enter your expiry year'),

  (req, res) => {
    const viewPath = './full-page-examples/passport-details'
    const errors = formatValidationErrors(validationResult(req))

    if (!errors) {
      return res.render(`${viewPath}/confirm`)
    }

    // If any of the date inputs error apply a general error.
    const expiryNamePrefix = 'expiry'
    const expiryErrors = Object.values(errors).filter((error) =>
      error.id.includes(`${expiryNamePrefix}-`)
    )

    if (expiryErrors.length) {
      const firstExpiryErrorId = expiryErrors[0].id
      // Get the first error message and merge it into a single error message.
      errors[expiryNamePrefix] = {
        id: expiryNamePrefix,
        href: `#${firstExpiryErrorId}`,
        value: '',
        text: ''
      }

      // Construct a single error message based on all three error messages.
      errors[expiryNamePrefix].text = 'Enter your expiry '
      if (expiryErrors.length === 3) {
        errors[expiryNamePrefix].text += 'date'
      } else {
        errors[expiryNamePrefix].text += expiryErrors
          .map((error) => error.text.replace('Enter your expiry ', ''))
          .join(' and ')
      }
    }

    let errorSummary = Object.values(errors)
    if (expiryErrors) {
      // Remove all other errors from the summary so we only have one message that links to the expiry input.
      errorSummary = errorSummary.filter(
        (error) => !error.id.includes(`${expiryNamePrefix}-`)
      )
    }

    res.render(`${viewPath}/index`, {
      errors,
      errorSummary,
      values: matchedData(req, { onlyValidData: false }) // In production this should sanitized.
    })
  }
)

export default router
