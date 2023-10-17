import { axe, goToComponent } from '@govuk-frontend/helpers/puppeteer'
import { getExamples } from '@govuk-frontend/lib/components'

describe('/components/checkboxes', () => {
  describe('component examples', () => {
    let exampleNames

    beforeAll(async () => {
      exampleNames = Object.keys(await getExamples('checkboxes'))
    })

    it('passes accessibility tests', async () => {
      for (const exampleName of exampleNames) {
        // Navigation to example, create report
        await goToComponent(page, 'checkboxes', { exampleName })
        await expect(axe(page)).resolves.toHaveNoViolations()
      }
    }, 120000)
  })
})
