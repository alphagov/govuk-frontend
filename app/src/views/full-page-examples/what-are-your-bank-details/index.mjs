import { body, validationResult } from 'express-validator'

import { formatValidationErrors } from '../../../utils.mjs'

export default (app) => {
  app.post(
    '/full-page-examples/what-are-your-bank-details',
    [
      body('name-on-the-account')
        .exists()
        .not().isEmpty().withMessage('Enter the name on the account'),
      body('sort-code')
        .exists()
        .matches(/[0-6]{6}/).withMessage('Enter a valid sort code like 309430')
        .not().isEmpty().withMessage('Enter a sort code'),
      body('account-number')
        .exists()
        .matches(/[0-9]{6}/).withMessage('Account number must be between 6 and 8 digits')
        .not().isEmpty().withMessage('Enter an account number')
    ],
    (request, response) => {
      const errors = formatValidationErrors(validationResult(request))
      if (errors) {
        return response.render('./full-page-examples/what-are-your-bank-details/index', {
          errors,
          errorSummary: Object.values(errors),
          values: request.body // In production this should sanitized.
        })
      }
      response.render('./full-page-examples/what-are-your-bank-details/confirm')
    }
  )
}
