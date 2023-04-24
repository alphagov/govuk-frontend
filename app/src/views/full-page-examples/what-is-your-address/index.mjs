import { body, validationResult } from 'express-validator'

import { formatValidationErrors } from '../../../utils.mjs'

/**
 * @param {import('express').Application} app
 */
export default (app) => {
  app.post(
    '/full-page-examples/what-is-your-address',
    [
      body('address-line-1')
        .exists()
        .not().isEmpty().withMessage('Enter your building and street'),
      body('address-town')
        .exists()
        .not().isEmpty().withMessage('Enter your town and city'),
      body('address-postcode')
        .exists()
        .not().isEmpty().withMessage('Enter your postcode')
    ],

    /**
     * @param {import('express').Request} request
     * @param {import('express').Response} response
     * @returns {void}
     */
    (request, response) => {
      const errors = formatValidationErrors(validationResult(request))
      if (errors) {
        return response.render('./full-page-examples/what-is-your-address/index', {
          errors,
          errorSummary: Object.values(errors),
          values: request.body // In production this should sanitized.
        })
      }
      response.render('./full-page-examples/what-is-your-address/confirm')
    }
  )
}
