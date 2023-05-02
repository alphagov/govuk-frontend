import { axe, goToComponent } from 'govuk-frontend-helpers/puppeteer'
import { getExamples } from 'govuk-frontend-lib/files'

describe('/components/textarea', () => {
  describe('component examples', () => {
    let exampleNames

    beforeAll(async () => {
      exampleNames = Object.keys(await getExamples('textarea'))
    })

    it('passes accessibility tests', async () => {
      for (const name of exampleNames) {
        const exampleName = name.replace(/ /g, '-')

        // Navigation to example, create report
        await goToComponent(page, 'textarea', { exampleName })
        await expect(axe(page)).resolves.toHaveNoViolations()
      }
    }, 60000)
  })
})
