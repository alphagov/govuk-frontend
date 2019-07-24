const cookieParser = require('cookie-parser')

const BANNER_COOKIE_NAME = 'dismissed-app-banner'

module.exports = function (app) {
  // Detect if banner should be shown based on cookies set
  app.use(cookieParser())
  app.use(function (request, response, next) {
    if ('hide-banner' in request.query) {
      app.locals.shouldShowAppBanner = false
      return next()
    }

    const cookie = request.cookies[BANNER_COOKIE_NAME]

    if (cookie === 'yes') {
      app.locals.shouldShowAppBanner = false
      return next()
    }

    app.locals.shouldShowAppBanner = true

    next()
  })

  app.post('/hide-banner', async function (request, response) {
    const maxAgeInDays = 28
    response.cookie(BANNER_COOKIE_NAME, 'yes', {
      maxAge: maxAgeInDays * 24 * 60 * 60 * 1000,
      httpOnly: true
    })
    // Redirect to where the user POSTed from.
    const previousURL = request.header('Referer') || '/'
    response.redirect(previousURL)
  })
}
