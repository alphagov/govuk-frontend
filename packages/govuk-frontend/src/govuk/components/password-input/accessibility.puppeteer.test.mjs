import { axe, render } from '@govuk-frontend/helpers/puppeteer'
import { getExamples } from '@govuk-frontend/lib/components'

describe('/components/password-input', () => {
  describe('component examples', () => {
    it('passes accessibility tests', async () => {
      const examples = await getExamples('password-input')

      for (const exampleName in examples) {
        await render(page, 'password-input', examples[exampleName])
        await expect(axe(page)).resolves.toHaveNoViolations()
      }
    }, 120000)
  })
})
