const express = require('express')
const bannerRouter = express.Router()

const cookieParser = require('cookie-parser')

const BANNER_COOKIE_NAME = 'dismissed-app-banner'

// Detect if banner should be shown based on cookies set
bannerRouter.use(cookieParser())
bannerRouter.use(function (request, response, next) {
  let cookie = request.cookies[BANNER_COOKIE_NAME]

  if (cookie === 'yes') {
    request.app.locals.shouldShowAppBanner = false
    return next()
  }

  request.app.locals.shouldShowAppBanner = true

  next()
})

bannerRouter.post('/hide-banner', async function (request, response) {
  let maxAgeInDays = 28
  response.cookie(BANNER_COOKIE_NAME, 'yes', {
    maxAge: maxAgeInDays * 24 * 60 * 60 * 1000,
    httpOnly: true
  })
  // Redirect to where the user POSTed from.
  let previousURL = request.header('Referer') || '/'
  response.redirect(previousURL)
})

module.exports = bannerRouter
