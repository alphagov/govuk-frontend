import { getExamples } from '@govuk-frontend/lib/components'
import { axe, goToComponent } from 'govuk-frontend-helpers/puppeteer'

describe('/components/tabs', () => {
  describe('component examples', () => {
    let exampleNames

    beforeAll(async () => {
      exampleNames = Object.keys(await getExamples('tabs'))
    })

    it('passes accessibility tests', async () => {
      for (const exampleName of exampleNames) {
        // Navigation to example, create report
        await goToComponent(page, 'tabs', { exampleName })
        await expect(axe(page)).resolves.toHaveNoViolations()
      }
    }, 90000)
  })
})
