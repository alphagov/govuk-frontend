module.exports = (app) => {
  app.post(
    '/full-page-examples/upload-your-photo-error',
    (request, response) => {
      return response.render('./full-page-examples/upload-your-photo-error/index', {
        isError: true
      })
    }
  )
}
