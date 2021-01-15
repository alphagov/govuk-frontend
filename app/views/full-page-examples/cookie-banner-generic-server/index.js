module.exports = (app) => {
  app.post(
    '/full-page-examples/cookie-banner-generic-server',
    (request, response) => {
      var cookiesData = request.body.cookies

      return response.render('./full-page-examples/cookie-banner-generic-server/index', {
        cookieConsent: cookiesData
      })
    }
  )
}
