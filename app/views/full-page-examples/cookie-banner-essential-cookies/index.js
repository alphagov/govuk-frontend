module.exports = (app) => {
  app.post('/full-page-examples/cookie-banner-essential-cookies', (request, response) => {
    response.render('./full-page-examples/cookie-banner-essential-cookies/index', {
      cookies: request.body.cookies
    })
  })
}
