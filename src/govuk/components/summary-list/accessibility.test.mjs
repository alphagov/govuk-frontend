import { axe, goToComponent } from 'govuk-frontend-helpers/puppeteer'
import { getExamples } from 'govuk-frontend-lib/files'

describe('/components/summary-list', () => {
  describe('component examples', () => {
    let exampleNames

    beforeAll(async () => {
      exampleNames = Object.keys(await getExamples('summary-list'))
    })

    it('passes accessibility tests', async () => {
      for (const name of exampleNames) {
        const exampleName = name.replace(/ /g, '-')

        // Navigation to example, create report
        await goToComponent(page, 'summary-list', { exampleName })
        await expect(axe(page)).resolves.toHaveNoViolations()
      }
    }, 60000)
  })
})
