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
      document.querySelector('.my-scope [data-module="govuk-accordion"]')
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

  class MockComponent {
    constructor(...args) {
      this.args = args
    }

    static moduleName = 'mock-component'
  }

  it('initialises a component, passing the component root', () => {
    const componentRoot = document.createElement('div')
    componentRoot.setAttribute('data-module', 'mock-component')
    document.body.appendChild(componentRoot)

    const result = createAll(MockComponent)

    expect(result).toStrictEqual([expect.any(MockComponent)])

    expect(result[0].args).toStrictEqual([componentRoot])
  })

  it('returns an empty array if no components exist on the page', () => {
    const result = createAll(MockComponent)

    expect(result).toStrictEqual([])
  })

  it('returns an empty array if no matching components exist on the page', () => {
    const componentRoot = document.createElement('div')
    componentRoot.setAttribute(
      'data-module',
      'this-is-not-the-component-you-are-looking-for'
    )
    document.body.appendChild(componentRoot)

    const result = createAll(MockComponent)

    expect(result).toStrictEqual([])
  })

  it('returns an array of instantiated component objects', () => {
    document.body.innerHTML = `
      <div data-module="mock-component" id="a"></div>
      <div data-module="mock-component" id="b"></div>`

    const result = createAll(MockComponent)

    expect(result).toStrictEqual([
      expect.any(MockComponent),
      expect.any(MockComponent)
    ])

    expect(result[0].args).toStrictEqual([document.getElementById('a')])
    expect(result[1].args).toStrictEqual([document.getElementById('b')])
  })

  describe('when a component accepts config', () => {
    class MockComponentWithConfig extends MockComponent {
      static defaults = {
        __test: false
      }
    }

    it('initialises a component, passing the component root and config', () => {
      const componentRoot = document.createElement('div')
      componentRoot.setAttribute('data-module', 'mock-component')
      document.body.appendChild(componentRoot)

      const result = createAll(MockComponentWithConfig, {
        __test: true
      })

      expect(result).toStrictEqual([expect.any(MockComponentWithConfig)])

      expect(result[0].args).toStrictEqual([
        componentRoot,
        {
          __test: true
        }
      ])
    })

    it('initialises a component, passing the component root even when no config is passed', () => {
      const componentRoot = document.createElement('div')
      componentRoot.setAttribute('data-module', 'mock-component')
      document.body.appendChild(componentRoot)

      const result = createAll(MockComponentWithConfig)

      expect(result).toStrictEqual([expect.any(MockComponentWithConfig)])

      console.log(result[0].args)

      expect(result[0].args).toStrictEqual([componentRoot])
    })

    it('passes the config to all component objects', () => {
      document.body.innerHTML = `
      <div data-module="mock-component" id="a"></div>
      <div data-module="mock-component" id="b"></div>`

      const config = {
        __test: true
      }

      const result = createAll(MockComponentWithConfig, config)

      expect(result).toStrictEqual([
        expect.any(MockComponentWithConfig),
        expect.any(MockComponentWithConfig)
      ])

      expect(result[0].args).toStrictEqual([
        document.getElementById('a'),
        config
      ])
      expect(result[1].args).toStrictEqual([
        document.getElementById('b'),
        config
      ])
    })
  })

  describe('when a $scope is passed', () => {
    it('only initialises components within that scope', () => {
      document.body.innerHTML = `
        <div data-module="mock-component"></div>
        <div class="not-in-scope">
          <div data-module="mock-component"></div>
        </div>'
        <div class="my-scope">
          <div data-module="mock-component"></div>
        </div>`

      const result = createAll(
        MockComponent,
        undefined,
        document.querySelector('.my-scope')
      )

      expect(result).toStrictEqual([expect.any(MockComponent)])

      expect(result[0].args).toStrictEqual([
        document.querySelector('.my-scope [data-module="mock-component"]')
      ])
    })
  })

  describe('when components throw errors', () => {
    class MockComponentThatErrors extends MockComponent {
      constructor($element, ...otherArgs) {
        super($element, ...otherArgs)
        if ($element.hasAttribute('data-boom')) {
          throw new Error('Error thrown from constructor')
        }
      }
    }

    it('catches errors thrown by components and logs them to the console', () => {
      document.body.innerHTML = `<div data-module="mock-component" data-boom></div>`

      // Silence warnings in test output, and allow us to 'expect' them
      jest.spyOn(global.console, 'log').mockImplementation()

      expect(() => {
        createAll(MockComponentThatErrors)
      }).not.toThrow()

      expect(global.console.log).toHaveBeenCalledWith(expect.any(Error))
      expect(global.console.log).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Error thrown from constructor'
        })
      )
    })

    it('omits components that failed to instantiate', () => {
      document.body.innerHTML = `
        <div data-module="mock-component" id="a"></div>
        <div data-module="mock-component" id="b" data-boom></div>
        <div data-module="mock-component" id="c"></div>`

      const result = createAll(MockComponentThatErrors)

      expect(result).toStrictEqual([
        expect.any(MockComponentThatErrors),
        expect.any(MockComponentThatErrors)
      ])

      expect(result[0].args).toStrictEqual([document.getElementById('a')])
      expect(result[1].args).toStrictEqual([document.getElementById('c')])
    })
  })
})
