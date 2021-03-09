module.exports = (app) => {
  app.post('/full-page-examples/cookie-banner-server-side', (request, response) => {
    response.render('./full-page-examples/cookie-banner-server-side/index', {
      cookies: request.body.cookies,
      currentUrl: request.url
    })
  })
}
