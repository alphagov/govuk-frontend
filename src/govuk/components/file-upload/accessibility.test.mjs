import { getExamples } from '@govuk-frontend/lib/components'
import { axe, goToComponent } from 'govuk-frontend-helpers/puppeteer'

describe('/components/file-upload', () => {
  describe('component examples', () => {
    let exampleNames

    beforeAll(async () => {
      exampleNames = Object.keys(await getExamples('file-upload'))
    })

    it('passes accessibility tests', async () => {
      for (const exampleName of exampleNames) {
        // Navigation to example, create report
        await goToComponent(page, 'file-upload', { exampleName })
        await expect(axe(page)).resolves.toHaveNoViolations()
      }
    }, 90000)
  })
})
