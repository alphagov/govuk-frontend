import { axe, render } from '@govuk-frontend/helpers/puppeteer'
import { getExamples } from '@govuk-frontend/lib/components'

describe('/components/details', () => {
  describe('component examples', () => {
    it('passes accessibility tests', async () => {
      const examples = await getExamples('details')

      for (const exampleName in examples) {
        await render(page, 'details', examples[exampleName])
        await expect(axe(page)).resolves.toHaveNoViolations()
      }
    }, 120000)
  })
})
