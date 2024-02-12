import express from 'express'
import { body, matchedData, validationResult } from 'express-validator'

import { formatValidationErrors } from '../../../utils.mjs'

const router = express.Router()

router.post(
  '/feedback',

  body('what-were-you-trying-to-do')
    .notEmpty()
    .withMessage('Enter what you were trying to do')
    .isLength({ max: 100 })
    .withMessage('What were you trying to do must be 100 characters or less'),

  body('detail')
    .notEmpty()
    .withMessage('Enter details of your question, problem or feedback')
    .isLength({ max: 300 })
    .withMessage(
      'Details of your question, problem or feedback must be 300 characters or less'
    ),

  body('do-you-want-a-reply')
    .notEmpty()
    .withMessage('Select yes if you want a reply'),

  body('name')
    .if(body('do-you-want-a-reply').equals('yes'))
    .notEmpty()
    .withMessage('Enter your name'),

  body('email')
    .if(body('do-you-want-a-reply').equals('yes'))
    .notEmpty()
    .withMessage('Enter your email address')
    .isEmail()
    .withMessage(
      'Enter an email address in the correct format, like name@example.com'
    ),

  (req, res) => {
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
  }
)

export default router
