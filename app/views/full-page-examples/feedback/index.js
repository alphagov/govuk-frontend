const { body, validationResult } = require('express-validator/check')
const { formatValidationErrors } = require('../../../utils.js')

module.exports = (app) => {
  app.post(
    '/full-page-examples/feedback',
    [
      body('what-were-you-trying-to-do')
        .exists()
        .not().isEmpty().withMessage('Enter what you were trying to do')
        .isLength({ max: 100 }).withMessage('What were you trying to do must be 100 characters or less'),
      body('detail')
        .exists()
        .not().isEmpty().withMessage('Enter details of your question, problem or feedback')
        .isLength({ max: 300 }).withMessage('Details of your question, problem or feedback must be 300 characters or less'),
      body('do-you-want-a-reply')
        .exists()
        .not().isEmpty().withMessage('Select yes if you want a reply'),
      body('name')
        .custom((value, { req: request }) => {
          // See https://github.com/express-validator/express-validator/pull/658
          const wantsReply = request.body['do-you-want-a-reply'] === 'yes'
          if (!wantsReply) {
            return true
          }
          if (!value) {
            throw new Error('Enter your name')
          }
          return true
        }),
      body('email')
        .custom((value, { req: request }) => {
          // See https://github.com/express-validator/express-validator/pull/658
          const wantsReply = request.body['do-you-want-a-reply'] === 'yes'
          if (!wantsReply) {
            return true
          }
          if (!value) {
            throw new Error('Enter your email address')
          }
          if (!value.includes('@')) {
            throw new Error('Enter an email address in the correct format, like name@example.com')
          }
          return true
        })

    ],
    (request, response) => {
      const errors = formatValidationErrors(validationResult(request))
      if (errors) {
        return response.render('./full-page-examples/feedback/index', {
          errors,
          errorSummary: Object.values(errors),
          values: request.body // In production this should sanitized.
        })
      }
      response.render('./full-page-examples/feedback/confirm')
    }
  )
}
