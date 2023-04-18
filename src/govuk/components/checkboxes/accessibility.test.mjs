import { axe, goToComponent } from 'govuk-frontend-helpers/puppeteer'
import { getExamples } from 'govuk-frontend-lib/files'

describe('/components/checkboxes', () => {
  let axeRules

  beforeAll(() => {
    axeRules = {
      /**
       * Ignore 'ARIA attribute is not allowed: aria-expanded="false"'
       *
       * {@link https://github.com/alphagov/govuk-frontend/issues/979}
       */
      'aria-allowed-attr': { enabled: false }
    }
  })

  describe('component examples', () => {
    let exampleNames

    beforeAll(async () => {
      exampleNames = Object.keys(await getExamples('checkboxes'))
    })

    it('passes accessibility tests', async () => {
      for (const name of exampleNames) {
        const exampleName = name.replace(/ /g, '-')

        // Navigation to example, create report
        await goToComponent(page, 'checkboxes', { exampleName })
        await expect(axe(page, axeRules)).resolves.toHaveNoViolations()
      }
    }, 60000)
  })
})
