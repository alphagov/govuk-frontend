import { getComponentNamesFiltered } from 'govuk-frontend-lib/components'
import { filterPath } from 'govuk-frontend-lib/files'

describe('GOV.UK Frontend', () => {
  describe('initAll', () => {
    beforeEach(async () => {
      jest.resetModules()

      // Components list (with JavaScript only)
      const componentNamesWithJavaScript = await getComponentNamesFiltered(
        (componentName, componentFiles) =>
          componentFiles.some(filterPath([`**/${componentName}.mjs`]))
      )

      // Mock all components
      componentNamesWithJavaScript.forEach((componentName) =>
        jest.doMock(`./components/${componentName}/${componentName}.mjs`)
      )

      // Add GOV.UK Frontend support
      document.body.classList.add('govuk-frontend-supported')
    })

    it('instantiates Accordion without errors', async () => {
      const $container = document.createElement('div')

      $container.setAttribute('data-module', 'govuk-accordion')
      document.body.appendChild($container)

      const { Accordion, initAll } = await import('./all.mjs')
      initAll()

      expect(Accordion).toBeCalled()
    })
  })
})
