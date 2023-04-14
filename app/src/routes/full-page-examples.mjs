import { getFullPageExamples } from '../../../lib/file-helper.js'
import * as routes from '../views/full-page-examples/index.mjs'

export default (app) => {
  routes.applicantDetails(app)
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
  routes.whatAreYourBankDetails(app)
  routes.whatIsYourDateOfBirth(app)
  routes.whatIsYourNationalInsuranceNumber(app)
  routes.whatIsYourNationality(app)
  routes.whatIsYourTelephoneNumber(app)
  routes.whatIsYourPostcode(app)
  routes.whatWasTheLastCountryYouVisited(app)

  app.get('/full-page-examples', async (req, res, next) => {
    res.locals.fullPageExamples = await getFullPageExamples()

    res.render('full-page-examples/index', (error, html) => {
      if (error) {
        next(error)
      } else {
        res.send(html)
      }
    })
  })

  // Display full page examples index by default if not handled already
  app.get('/full-page-examples/:exampleName', function (req, res, next) {
    res.render(`full-page-examples/${req.params.exampleName}/index`, function (error, html) {
      if (error) {
        next(error)
      } else {
        res.send(html)
      }
    })
  })
}
