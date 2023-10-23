import { axe, render } from '@govuk-frontend/helpers/puppeteer'
import { getExamples } from '@govuk-frontend/lib/components'

describe('/components/button', () => {
  let axeRules

  beforeAll(() => {
    axeRules = {
      /**
       * Ignore 'Invalid ARIA attribute value: aria-controls="example-id"'
       * for missing IDs
       */
      'aria-valid-attr-value': { enabled: false }
    }
  })

  describe('component examples', () => {
    it('passes accessibility tests', async () => {
      const examples = await getExamples('button')

      for (const exampleName in examples) {
        await render(page, 'button', examples[exampleName])
        await expect(axe(page, axeRules)).resolves.toHaveNoViolations()
      }
    }, 120000)
  })
})
