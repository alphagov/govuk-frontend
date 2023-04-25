import { axe, goToComponent } from 'govuk-frontend-helpers/puppeteer'
import { getExamples } from 'govuk-frontend-lib/files'

describe('/components/button', () => {
  let axeRules

  beforeAll(() => {
    axeRules = {
      /**
       * Ignore 'Invalid ARIA attribute value: aria-controls="example-id"'
       * for missing IDs
       */
      'aria-valid-attr-value': { enabled: false }
    }
  })

  describe('component examples', () => {
    let exampleNames

    beforeAll(async () => {
      exampleNames = Object.keys(await getExamples('button'))
    })

    it('passes accessibility tests', async () => {
      for (const name of exampleNames) {
        const exampleName = name.replace(/ /g, '-')

        // Navigation to example, create report
        await goToComponent(page, 'button', { exampleName })
        await expect(axe(page, axeRules)).resolves.toHaveNoViolations()
      }
    }, 60000)
  })
})
