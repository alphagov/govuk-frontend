/**
 * @param {import('express').Application} app
 */
export default (app) => {
  app.post(
    '/full-page-examples/upload-your-photo-success',

    (req, res) => {
      return res.render(
        './full-page-examples/upload-your-photo-success/index',
        {
          isSuccess: true
        }
      )
    }
  )
}
