module.exports = (app) => {
  app.post(
    '/full-page-examples/upload-your-photo-success',
    (request, response) => {
      return response.render('./full-page-examples/upload-your-photo-success/index', {
        isSuccess: true
      })
    }
  )
}
