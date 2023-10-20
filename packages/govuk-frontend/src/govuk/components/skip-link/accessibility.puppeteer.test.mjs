import { axe, render } from '@govuk-frontend/helpers/puppeteer'
import { getExamples } from '@govuk-frontend/lib/components'

describe('/components/skip-link', () => {
  describe('component examples', () => {
    it('passes accessibility tests', async () => {
      const examples = await getExamples('skip-link')

      for (const exampleName in examples) {
        await render(page, 'skip-link', examples[exampleName])
          // Log errors for invalid examples
          .catch(({ message }) => console.warn(message))

        await expect(axe(page)).resolves.toHaveNoViolations()
      }
    }, 120000)
  })
})
