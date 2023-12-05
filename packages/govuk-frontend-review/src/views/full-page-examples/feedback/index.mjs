import express from 'express'
import { body, matchedData, validationResult } from 'express-validator'

import { formatValidationErrors } from '../../../utils.mjs'

const router = express.Router()

router.post(
  '/feedback',

  body('what-were-you-trying-to-do')
    .exists()
    .not()
    .isEmpty()
    .withMessage('Enter what you were trying to do')
    .isLength({ max: 100 })
    .withMessage('What were you trying to do must be 100 characters or less'),

  body('detail')
    .exists()
    .not()
    .isEmpty()
    .withMessage('Enter details of your question, problem or feedback')
    .isLength({ max: 300 })
    .withMessage(
      'Details of your question, problem or feedback must be 300 characters or less'
    ),

  body('do-you-want-a-reply')
    .not()
    .isEmpty()
    .withMessage('Select yes if you want a reply'),

  body('name').custom((value, { req }) => {
    // See https://github.com/express-validator/express-validator/pull/658
    const wantsReply = req.body['do-you-want-a-reply'] === 'yes'
    if (!wantsReply) {
      return true
    }
    if (!value) {
      throw new Error('Enter your name')
    }
    return true
  }),

  body('email').custom((value, { req }) => {
    // See https://github.com/express-validator/express-validator/pull/658
    const wantsReply = req.body['do-you-want-a-reply'] === 'yes'
    if (!wantsReply) {
      return true
    }
    if (!value) {
      throw new Error('Enter your email address')
    }
    if (!value.includes('@')) {
      throw new Error(
        'Enter an email address in the correct format, like name@example.com'
      )
    }
    return true
  }),

  (req, res) => {
    const viewPath = './full-page-examples/feedback'
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
