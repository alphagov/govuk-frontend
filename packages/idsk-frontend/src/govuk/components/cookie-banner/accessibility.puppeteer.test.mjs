import { axe, render } from '@govuk-frontend/helpers/puppeteer'
import { getExamples } from '@govuk-frontend/lib/components'

describe('/components/cookie-banner', () => {
  let axeRules

  beforeAll(() => {
    axeRules = {
      /**
       * Ignore 'Element has insufficient color contrast' for WCAG Level AAA
       *
       * Affects 'Accept analytics cookies', 'Reject analytics cookies' buttons,
       * and 'View cookie preferences' link
       */
      'color-contrast-enhanced': { enabled: false }
    }
  })

  describe('component examples', () => {
    it('passes accessibility tests', async () => {
      const examples = await getExamples('cookie-banner')

      for (const exampleName in examples) {
        await render(page, 'cookie-banner', examples[exampleName])
        await expect(axe(page, axeRules)).resolves.toHaveNoViolations()
      }
    }, 120000)
  })
})
