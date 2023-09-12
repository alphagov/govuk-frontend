import { axe, goToComponent } from '@govuk-frontend/helpers/puppeteer'
import { getExamples } from '@govuk-frontend/lib/components'

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
      for (const exampleName of exampleNames) {
        // Navigation to example, create report
        await goToComponent(page, 'button', { exampleName })
        await expect(axe(page, axeRules)).resolves.toHaveNoViolations()
      }
    }, 90000)
  })
})
