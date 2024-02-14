import { axe, render } from '@govuk-frontend/helpers/puppeteer'
import { getExamples } from '@govuk-frontend/lib/components'

describe('/components/accordion', () => {
  let axeRules

  beforeAll(() => {
    axeRules = {
      // Ignore colour contrast (enhanced) from WCAG Level AAA
      'color-contrast-enhanced': { enabled: false }
    }
  })

  describe('component examples', () => {
    it('passes accessibility tests', async () => {
      const examples = await getExamples('accordion')

      for (const exampleName in examples) {
        await render(page, 'accordion', examples[exampleName])
        await expect(axe(page, axeRules)).resolves.toHaveNoViolations()
      }
    }, 120000)
  })
})
