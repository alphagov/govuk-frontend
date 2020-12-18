module.exports = (app) => {
  app.post(
    '/full-page-examples/cookie-banner-2-server',
    (request, response) => {
      var cookiesData = request.body.cookies

      return response.render('./full-page-examples/cookie-banner-2-server/index', {
        cookieConsent: cookiesData
      })
    }
  )
}
