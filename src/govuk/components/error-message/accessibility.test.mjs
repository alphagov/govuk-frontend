import { getExamples } from '@govuk-frontend/lib/components'
import { axe, goToComponent } from 'govuk-frontend-helpers/puppeteer'

describe('/components/error-message', () => {
  describe('component examples', () => {
    let exampleNames

    beforeAll(async () => {
      exampleNames = Object.keys(await getExamples('error-message'))
    })

    it('passes accessibility tests', async () => {
      for (const exampleName of exampleNames) {
        // Navigation to example, create report
        await goToComponent(page, 'error-message', { exampleName })
        await expect(axe(page)).resolves.toHaveNoViolations()
      }
    }, 90000)
  })
})
