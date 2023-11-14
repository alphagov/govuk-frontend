import { getFullPageExamples } from '../common/lib/files.mjs'
import * as routes from '../views/full-page-examples/index.mjs'

/**
 * @param {import('express').Application} app
 */
export default (app) => {
  routes.cookieBannerEssentialCookies(app)
  routes.cookieBannerServerSide(app)
  routes.haveYouChangedYourName(app)
  routes.feedback(app)
  routes.howDoYouWantToSignIn(app)
  routes.search(app)
  routes.passportDetails(app)
  routes.updateYourAccountDetails(app)
  routes.uploadYourPhoto(app)
  routes.uploadYourPhotoSuccess(app)
  routes.whatIsYourAddress(app)
  routes.whatIsYourNationality(app)
  routes.whatIsYourPostcode(app)
  routes.whatWasTheLastCountryYouVisited(app)

  app.get('/full-page-examples', async (req, res) => {
    res.locals.fullPageExamples = await getFullPageExamples()

    res.render('full-page-examples/index')
  })

  // Display full page examples index by default if not handled already
  app.get('/full-page-examples/:exampleName', function (req, res) {
    res.render(`full-page-examples/${req.params.exampleName}/index`)
  })
}
