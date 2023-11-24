/**
 * @param {import('express').Application} app
 */
export default (app) => {
  app.post('/full-page-examples/cookie-banner-server-side', (req, res) => {
    res.render('./full-page-examples/cookie-banner-server-side/index', {
      cookies: req.body.cookies,
      currentUrl: req.url
    })
  })
}
