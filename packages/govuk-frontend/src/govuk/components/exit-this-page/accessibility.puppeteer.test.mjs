import { axe, render } from '@govuk-frontend/helpers/puppeteer'
import { getExamples } from '@govuk-frontend/lib/components'

describe('/components/exit-this-page', () => {
  let axeRules

  beforeAll(() => {
    axeRules = {
      /**
       * Ignore 'Element has insufficient color contrast' for WCAG Level AAA
       *
       * Affects link to '/full-page-examples/announcements'
       */
      'color-contrast-enhanced': { enabled: false }
    }
  })
  describe('component examples', () => {
    it('passes accessibility tests', async () => {
      const examples = await getExamples('exit-this-page')

      for (const exampleName in examples) {
        await render(page, 'exit-this-page', examples[exampleName])
        await expect(axe(page, axeRules)).resolves.toHaveNoViolations()
      }
    }, 120000)
  })
})
