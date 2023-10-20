import { axe, render } from '@govuk-frontend/helpers/puppeteer'
import { getExamples } from '@govuk-frontend/lib/components'

describe('/components/notification-banner', () => {
  let axeRules

  beforeAll(() => {
    axeRules = {
      /**
       * Ignore 'The banner landmark is contained in another landmark'
       * for wrapping 'main'
       */
      'landmark-banner-is-top-level': { enabled: false },

      /**
       * Ignore 'Element has a tabindex greater than 0' for custom
       * tabindex tests
       */
      tabindex: { enabled: false }
    }
  })

  describe('component examples', () => {
    it('passes accessibility tests', async () => {
      const examples = await getExamples('notification-banner')

      for (const exampleName in examples) {
        await render(page, 'notification-banner', examples[exampleName])
        await expect(axe(page, axeRules)).resolves.toHaveNoViolations()
      }
    }, 120000)
  })
})
