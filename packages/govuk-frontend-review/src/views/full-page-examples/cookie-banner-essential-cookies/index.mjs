/**
 * @param {import('express').Application} app
 */
export default (app) => {
  app.post(
    '/full-page-examples/cookie-banner-essential-cookies',
    (req, res) => {
      res.render('./full-page-examples/cookie-banner-essential-cookies/index', {
        cookies: req.body.cookies
      })
    }
  )
}
