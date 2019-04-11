const express = require('express')
const exampleRouter = express.Router()

exampleRouter.get('/:example', (request, response, next) => {
  response.render(`${request.params.example}/index`,
    (error, html) => {
      if (error) {
        next(error)
      } else {
        response.send(html)
      }
    })
})

module.exports = exampleRouter
