import { axe, render } from '@govuk-frontend/helpers/puppeteer'
import { getExamples } from '@govuk-frontend/lib/components'

describe('/components/button', () => {
  let axeRules

  beforeAll(() => {
    axeRules = {
      /**
       * Ignore 'Element has insufficient color contrast' for WCAG Level AAA
       *
       * Affects 'Save and continue' button
       */
      'color-contrast-enhanced': { enabled: false }
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
