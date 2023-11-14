import { getFullPageExamples } from '../common/lib/files.mjs'
import * as routes from '../views/full-page-examples/index.mjs'

const fullPageExamples = await getFullPageExamples()
const fullPageExampleNames = fullPageExamples.map(({ path }) => path)

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

  /**
   * Full page examples index
   */
  app.get('/full-page-examples', async (req, res) => {
    res.render('full-page-examples/index', {
      fullPageExamples
    })
  })

  /**
   * Full page example
   */
  app.get('/full-page-examples/:exampleName', (req, res, next) => {
    const { exampleName } = req.params

    // No matching example so continue to page not found
    if (!fullPageExampleNames.includes(exampleName)) {
      return next()
    }

    res.render(`full-page-examples/${exampleName}/index`)
  })
}
