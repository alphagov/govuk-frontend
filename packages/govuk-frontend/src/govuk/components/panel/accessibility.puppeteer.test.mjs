import { axe, render } from '@govuk-frontend/helpers/puppeteer'
import { getExamples } from '@govuk-frontend/lib/components'

describe('/components/panel', () => {
  let axeRules

  beforeAll(() => {
    axeRules = {
      /**
       * Ignore 'Element has insufficient color contrast' for WCAG Level AAA
       *
       * Affects regular size text on the green and blue panels
       */
      'color-contrast-enhanced': { enabled: false }
    }
  })
  describe('component examples', () => {
    it('passes accessibility tests', async () => {
      const examples = await getExamples('panel')

      for (const exampleName in examples) {
        await render(page, 'panel', examples[exampleName])
        await expect(axe(page, axeRules)).resolves.toHaveNoViolations()
      }
    }, 120000)
  })
})
