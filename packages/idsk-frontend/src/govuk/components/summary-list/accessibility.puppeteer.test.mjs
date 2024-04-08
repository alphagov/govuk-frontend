import { axe, render } from '@govuk-frontend/helpers/puppeteer'
import { getExamples } from '@govuk-frontend/lib/components'

describe('/components/summary-list', () => {
  let axeRules

  beforeAll(() => {
    axeRules = {
      /**
       * Ignore 'Element has insufficient color contrast' for WCAG Level AAA
       *
       * Affects 'name', 'date of birth' and 'contact information' links
       */
      'color-contrast-enhanced': { enabled: false }
    }
  })
  describe('component examples', () => {
    it('passes accessibility tests', async () => {
      const examples = await getExamples('summary-list')

      for (const exampleName in examples) {
        await render(page, 'summary-list', examples[exampleName])
        await expect(axe(page, axeRules)).resolves.toHaveNoViolations()
      }
    }, 120000)
  })
})
