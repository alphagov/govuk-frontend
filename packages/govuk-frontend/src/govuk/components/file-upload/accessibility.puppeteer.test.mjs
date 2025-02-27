import { axe, render } from '@govuk-frontend/helpers/puppeteer'
import { getExamples } from '@govuk-frontend/lib/components'

describe('/components/file-upload', () => {
  describe('component examples', () => {
    it('passes accessibility tests', async () => {
      const examples = await getExamples('file-upload')

      for (const exampleName in examples) {
        // JavaScript enhancements being optional, some examples will not have
        // any element with `data-module="govuk-file-upload"`. This causes an error
        // as `render` assumes that if a component is exported by GOV.UK Frontend
        // its rendered markup will have a `data-module` and tried to initialise
        // the JavaScript component, even if no element with the right `data-module`
        // is on the page.
        //
        // Because of this, we need to filter `ElementError` thrown by the JavaScript
        // component to examples that actually run the JavaScript enhancements
        try {
          await render(page, 'file-upload', examples[exampleName])
        } catch (e) {
          const macroOptions = /** @type {MacroOptions} */ (
            examples[exampleName].context
          )

          const exampleUsesJavaScript = macroOptions.javascript
          const exampleLackedRoot = e.message.includes(
            'govuk-file-upload: Root element'
          )

          if (!exampleLackedRoot || exampleUsesJavaScript) {
            throw e
          }
        }
        await expect(axe(page)).resolves.toHaveNoViolations()
      }
    }, 120000)
  })
})

/**
 * @import {MacroOptions} from '@govuk-frontend/lib/components'
 */
