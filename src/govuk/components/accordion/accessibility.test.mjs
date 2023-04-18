import { axe, goToComponent } from 'govuk-frontend-helpers/puppeteer'
import { getExamples } from 'govuk-frontend-lib/files'

describe('/components/accordion', () => {
  let axeRules

  beforeAll(() => {
    axeRules = {
      /**
       * Ignore 'aria-labelledby attribute cannot be used on a div with
       * no valid role attribute'
       *
       * {@link https://github.com/alphagov/govuk-frontend/issues/2472}
       */
      'aria-allowed-attr': { enabled: false }
    }
  })

  describe('component examples', () => {
    let exampleNames

    beforeAll(async () => {
      exampleNames = Object.keys(await getExamples('accordion'))
    })

    it('passes accessibility tests', async () => {
      for (const name of exampleNames) {
        const exampleName = name.replace(/ /g, '-')

        // Navigation to example, create report
        await goToComponent(page, 'accordion', { exampleName })
        await expect(axe(page, axeRules)).resolves.toHaveNoViolations()
      }
    }, 60000)
  })
})
