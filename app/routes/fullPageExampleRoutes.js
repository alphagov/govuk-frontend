const express = require('express')
const fullPageExampleRouter = express.Router()

// Display full page examples index by default if not handled already
fullPageExampleRouter.get('/:example', (req, res, next) => {
  res.render(`${req.params.example}/index`, (error, html) => {
    if (error) {
      next(error)
    } else {
      res.send(html)
    }
  })
})

// Needed to perform validations when the forms are posted
fullPageExampleRouter.use([
  require('../views/full-page-examples/have-you-changed-your-name'),
  require('../views/full-page-examples/feedback'),
  require('../views/full-page-examples/how-do-you-want-to-sign-in'),
  require('../views/full-page-examples/passport-details'),
  require('../views/full-page-examples/update-your-account-details'),
  require('../views/full-page-examples/upload-your-photo'),
  require('../views/full-page-examples/what-is-your-address'),
  require('../views/full-page-examples/what-is-your-nationality'),
  require('../views/full-page-examples/what-is-your-postcode'),
  require('../views/full-page-examples/what-was-the-last-country-you-visited')
])

module.exports = fullPageExampleRouter
