import { axe, goToComponent } from '@govuk-frontend/helpers/puppeteer'
import { getExamples } from '@govuk-frontend/lib/components'

describe('/components/phase-banner', () => {
  describe('component examples', () => {
    let exampleNames

    beforeAll(async () => {
      exampleNames = Object.keys(await getExamples('phase-banner'))
    })

    it('passes accessibility tests', async () => {
      for (const exampleName of exampleNames) {
        // Navigation to example, create report
        await goToComponent(page, 'phase-banner', { exampleName })
        await expect(axe(page)).resolves.toHaveNoViolations()
      }
    }, 120000)
  })
})
