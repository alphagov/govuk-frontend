import { getExamples } from '@govuk-frontend/lib/components'
import { axe, goToComponent } from 'govuk-frontend-helpers/puppeteer'

describe('/components/fieldset', () => {
  describe('component examples', () => {
    let exampleNames

    beforeAll(async () => {
      exampleNames = Object.keys(await getExamples('fieldset'))
    })

    it('passes accessibility tests', async () => {
      for (const exampleName of exampleNames) {
        // Navigation to example, create report
        await goToComponent(page, 'fieldset', { exampleName })
        await expect(axe(page)).resolves.toHaveNoViolations()
      }
    }, 90000)
  })
})
