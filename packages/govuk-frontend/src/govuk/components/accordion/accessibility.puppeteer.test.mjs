import { axe, render } from '@govuk-frontend/helpers/puppeteer'
import { getExamples } from '@govuk-frontend/lib/components'

describe('/components/accordion', () => {
  let axeRules

  beforeAll(() => {
    axeRules = {
      /**
       * Ignore 'aria-labelledby attribute cannot be used on a div with
       * no valid role attribute'
       *
       * {@link https://github.com/alphagov/govuk-frontend/issues/2472}
       */
      'aria-prohibited-attr': { enabled: false }
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
