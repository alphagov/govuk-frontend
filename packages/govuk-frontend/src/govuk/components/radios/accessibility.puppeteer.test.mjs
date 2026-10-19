import { axe, render } from '@govuk-frontend/helpers/puppeteer'
import { getExamples } from '@govuk-frontend/lib/components'

describe('/components/radios', () => {
  let axeRules

  beforeAll(() => {
    axeRules = {}
  })

  describe('component examples', () => {
    it('passes accessibility tests', async () => {
      const examples = await getExamples('radios')

      for (const exampleName in examples) {
        await render(page, 'radios', examples[exampleName])
        await expect(axe(page, axeRules)).resolves.toHaveNoViolations()
      }
    }, 120000)
  })
})
