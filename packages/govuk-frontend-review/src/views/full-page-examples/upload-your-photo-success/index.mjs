/**
 * @param {import('express').Application} app
 */
export default (app) => {
  app.post(
    '/full-page-examples/upload-your-photo-success',

    /**
     * @param {import('express').Request} request
     * @param {import('express').Response} response
     * @returns {void}
     */
    (request, response) => {
      return response.render('./full-page-examples/upload-your-photo-success/index', {
        isSuccess: true
      })
    }
  )
}
