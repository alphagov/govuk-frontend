import {
  componentNameToClassName,
  componentNameToConfigName
} from '@govuk-frontend/lib/names'

import * as GOVUKFrontend from './all.mjs'
import { initAll, createAll } from './init.mjs'

// Annoyingly these don't get hoisted if done in a loop
jest.mock(`./components/accordion/accordion.mjs`)
jest.mock(`./components/button/button.mjs`)
jest.mock(`./components/character-count/character-count.mjs`)
jest.mock(`./components/checkboxes/checkboxes.mjs`)
jest.mock(`./components/error-summary/error-summary.mjs`)
jest.mock(`./components/exit-this-page/exit-this-page.mjs`)
jest.mock(`./components/header/header.mjs`)
jest.mock(`./components/notification-banner/notification-banner.mjs`)
jest.mock(`./components/password-input/password-input.mjs`)
jest.mock(`./components/radios/radios.mjs`)
jest.mock(`./components/skip-link/skip-link.mjs`)
jest.mock(`./components/tabs/tabs.mjs`)

describe('initAll', () => {
  const components = ['checkboxes', 'header', 'radios', 'skip-link', 'tabs']

  const componentsThatTakeConfig = [
    'accordion',
    'button',
    'character-count',
    'error-summary',
    'exit-this-page',
    'notification-banner',
    'password-input'
  ]

  afterEach(() => {
    document.body.innerHTML = ''
    document.body.className = ''
  })

  it.each(components)(
    'initialises %s, passing the component root',
    (componentName) => {
      const className = componentNameToClassName(componentName)
      document.body.classList.add('govuk-frontend-supported')
      document.body.innerHTML = `<div data-module="govuk-${componentName}"></div>`

      initAll()

      expect(GOVUKFrontend[className]).toHaveBeenCalledWith(
        document.querySelector(`[data-module="govuk-${componentName}"]`)
      )
    }
  )

  it.each(componentsThatTakeConfig)(
    'initialises %s, passing the component root and config',
    (componentName) => {
      const className = componentNameToClassName(componentName)
      const configName = componentNameToConfigName(componentName)

      document.body.classList.add('govuk-frontend-supported')
      document.body.innerHTML = `<div data-module="govuk-${componentName}"></div>`

      initAll({
        [configName]: { __test: true }
      })

      expect(GOVUKFrontend[className]).toHaveBeenCalledWith(
        document.querySelector(`[data-module="govuk-${componentName}"]`),
        { __test: true }
      )
    }
  )

  describe('govuk-frontend-supported not present', () => {
    beforeAll(() => {
      // Silence warnings in test output, and allow us to 'expect' them
      jest.spyOn(global.console, 'log').mockImplementation()
    })

    it('returns early', () => {
      document.body.innerHTML = '<div data-module="govuk-accordion"></div>'

      initAll()

      expect(GOVUKFrontend.Accordion).not.toHaveBeenCalled()
    })

    it('logs why it did not initialise components', () => {
      initAll()

      // Only validate the message as it's the important part for the user
      expect(global.console.log).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'GOV.UK Frontend is not supported in this browser'
        })
      )
    })
  })

  it('only initialises components within a given scope', () => {
    document.body.classList.add('govuk-frontend-supported')
    document.body.innerHTML = `
      <div data-module="govuk-accordion"></div>
      <div class="not-in-scope">
        <div data-module="govuk-accordion"></div>
      </div>'
      <div class="my-scope">
        <div data-module="govuk-accordion"></div>
      </div>`

    initAll({
      scope: document.querySelector('.my-scope')
    })

    // Expect to have been called exactly once with the accordion in .my-scope
    expect(GOVUKFrontend.Accordion).toHaveBeenCalledTimes(1)
    expect(GOVUKFrontend.Accordion).toHaveBeenCalledWith(
      document.querySelector('.my-scope [data-module="govuk-accordion"]'),
      undefined
    )
  })

  it('catches errors thrown by components and logs them to the console', () => {
    document.body.classList.add('govuk-frontend-supported')
    document.body.innerHTML = '<div data-module="govuk-accordion"></div>'

    jest.mocked(GOVUKFrontend.Accordion).mockImplementation(() => {
      throw new Error('Error thrown from accordion')
    })

    // Silence warnings in test output, and allow us to 'expect' them
    jest.spyOn(global.console, 'log').mockImplementation()

    expect(() => {
      initAll()
    }).not.toThrow()

    expect(global.console.log).toHaveBeenCalledWith(expect.any(Error))
    expect(global.console.log).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Error thrown from accordion'
      })
    )
  })
})

describe('createAll', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('initialises a component, passing the component root', () => {
    const constructorSpy = jest.fn()

    class MockComponent {
      constructor(...args) {
        constructorSpy(...args)
      }

      static moduleName = 'mock-component'
    }

    const componentRoot = document.createElement('div')
    componentRoot.setAttribute('data-module', 'mock-component')
    document.body.appendChild(componentRoot)

    createAll(MockComponent)

    expect(constructorSpy).toHaveBeenCalledWith(componentRoot)
  })

  it('initialises a component, passing the component root and config', () => {
    const constructorSpy = jest.fn()

    class MockComponent {
      constructor(...args) {
        constructorSpy(...args)
      }

      static moduleName = 'mock-component'

      static defaults = {
        __test: false
      }
    }

    const componentRoot = document.createElement('div')
    componentRoot.setAttribute('data-module', 'mock-component')
    document.body.appendChild(componentRoot)

    createAll(MockComponent, {
      __test: true
    })

    expect(constructorSpy).toHaveBeenCalledWith(componentRoot, {
      __test: true
    })
  })

  it('returns an empty array if no components exist on the page', () => {
    class MockComponent {
      static moduleName = 'mock-component'
    }

    const result = createAll(MockComponent)

    expect(result).toEqual([])
  })

  it('returns an array of instantiated component objects', () => {
    class MockComponent {
      static moduleName = 'mock-component'
    }

    document.body.innerHTML = `
      <div data-module="mock-component"></div>
      <div data-module="mock-component"></div>`

    const result = createAll(MockComponent)

    expect(result).toEqual([
      expect.any(MockComponent),
      expect.any(MockComponent)
    ])
  })

  it('only initialises components within a given scope', () => {
    const constructorSpy = jest.fn()

    class MockComponent {
      constructor(...args) {
        constructorSpy(...args)
      }

      static moduleName = 'mock-component'

      static defaults = {
        __test: false
      }
    }

    document.body.innerHTML = `
      <div data-module="mock-component"></div>
      <div class="not-in-scope">
        <div data-module="mock-component"></div>
      </div>'
      <div class="my-scope">
        <div data-module="mock-component"></div>
      </div>`

    createAll(MockComponent, undefined, document.querySelector('.my-scope'))

    // Expect to have been called exactly once with the mock-component in .my-scope
    expect(constructorSpy).toHaveBeenCalledTimes(1)
    expect(constructorSpy).toHaveBeenCalledWith(
      document.querySelector('.my-scope [data-module="mock-component"]'),
      undefined
    )
  })

  it('catches errors thrown by components and logs them to the console', () => {
    class MockComponent {
      constructor(...args) {
        throw new Error('Error thrown from constructor')
      }

      static moduleName = 'mock-component'
    }

    document.body.innerHTML = `<div data-module="mock-component"></div>`

    // Silence warnings in test output, and allow us to 'expect' them
    jest.spyOn(global.console, 'log').mockImplementation()

    expect(() => {
      createAll(MockComponent)
    }).not.toThrow()

    expect(global.console.log).toHaveBeenCalledWith(expect.any(Error))
    expect(global.console.log).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Error thrown from constructor'
      })
    )
  })

  it('omits components that failed to instantiate', () => {
    class MockComponent {
      constructor($element) {
        if ($element.hasAttribute('data-boom')) {
          throw new Error('Error thrown from constructor')
        }
      }

      static moduleName = 'mock-component'
    }

    document.body.innerHTML = `
      <div data-module="mock-component"></div>
      <div data-module="mock-component" data-boom="true"></div>
      <div data-module="mock-component"></div>`

    const result = createAll(MockComponent)

    expect(result).toEqual([
      expect.any(MockComponent),
      expect.any(MockComponent)
    ])
  })
})
