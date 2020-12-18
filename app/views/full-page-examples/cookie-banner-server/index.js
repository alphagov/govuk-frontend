module.exports = (app) => {
  app.post(
    '/full-page-examples/cookie-banner-server',
    (request, response) => {
      var cookiesData = request.body.cookies

      return response.render('./full-page-examples/cookie-banner-server/index', {
        cookieConsent: cookiesData
      })
    }
  )
}
