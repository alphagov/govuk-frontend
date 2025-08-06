import {
  componentNameToClassName,
  componentNameToConfigName
} from '@govuk-frontend/lib/names'

import * as GOVUKFrontend from './all.mjs'
import { Component } from './component.mjs'
import { ElementError } from './errors/index.mjs'
import { initAll, createAll } from './init.mjs'

// Annoyingly these don't get hoisted if done in a loop
jest.mock(`./components/accordion/accordion.mjs`)
jest.mock(`./components/button/button.mjs`)
jest.mock(`./components/character-count/character-count.mjs`)
jest.mock(`./components/checkboxes/checkboxes.mjs`)
jest.mock(`./components/error-summary/error-summary.mjs`)
jest.mock(`./components/exit-this-page/exit-this-page.mjs`)
jest.mock(`./components/file-upload/file-upload.mjs`)
jest.mock(`./components/header/header.mjs`)
jest.mock(`./components/notification-banner/notification-banner.mjs`)
jest.mock(`./components/password-input/password-input.mjs`)
jest.mock(`./components/radios/radios.mjs`)
jest.mock(`./components/service-navigation/service-navigation.mjs`)
jest.mock(`./components/skip-link/skip-link.mjs`)
jest.mock(`./components/tabs/tabs.mjs`)

describe('initAll', () => {
  const components = [
    'checkboxes',
    'header',
    'radios',
    'service-navigation',
    'skip-link',
    'tabs'
  ]

  const componentsThatTakeConfig = [
    'accordion',
    'button',
    'character-count',
    'error-summary',
    'exit-this-page',
    'file-upload',
    'notification-banner',
    'password-input'
  ]

  beforeEach(() => {
    // Silence warnings in test output, and allow us to 'expect' them
    jest.spyOn(console, 'log').mockImplementation()
  })

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
    it('returns early', () => {
      document.body.innerHTML = '<div data-module="govuk-accordion"></div>'

      initAll()

      expect(GOVUKFrontend.Accordion).not.toHaveBeenCalled()
    })

    it('logs why it did not initialise components', () => {
      initAll()

      // Only validate the message as it's the important part for the user
      expect(console.log).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'SupportError',
          message: 'GOV.UK Frontend is not supported in this browser'
        })
      )
    })

    it('executes onError if specified', () => {
      const errorCallback = jest.fn((_error, _context) => {})

      initAll({
        accordion: {
          rememberExpanded: true
        },
        onError: errorCallback
      })

      expect(console.log).not.toHaveBeenCalled()

      expect(errorCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'SupportError',
          message: 'GOV.UK Frontend is not supported in this browser'
        }),
        expect.objectContaining({
          config: {
            accordion: {
              rememberExpanded: true
            },
            onError: errorCallback
          }
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

  it('catches errors thrown when a given scope is null and logs them to the console', () => {
    document.body.classList.add('govuk-frontend-supported')
    document.body.innerHTML = `
      <div data-module="govuk-accordion"></div>
      <div class="not-in-scope">
        <div data-module="govuk-accordion"></div>
      </div>'
      <div class="my-scope">
        <div data-module="govuk-accordion"></div>
      </div>`

    // Silence warnings in test output, and allow us to 'expect' them
    jest.spyOn(global.console, 'log').mockImplementation()

    expect(() => {
      initAll({
        scope: document.querySelector('.unknown-scope')
      })
    }).not.toThrow()

    expect(global.console.log).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'ElementError',
        message: 'GOV.UK Frontend scope element (`$scope`) not found'
      })
    )

    expect(GOVUKFrontend.Accordion).not.toHaveBeenCalled()
  })

  it('catches errors thrown by components and logs them to the console', () => {
    document.body.classList.add('govuk-frontend-supported')
    document.body.innerHTML = '<div data-module="govuk-accordion"></div>'

    jest.mocked(GOVUKFrontend.Accordion).mockImplementation(() => {
      throw new Error('Error thrown from accordion')
    })

    expect(() => {
      initAll()
    }).not.toThrow()

    expect(console.log).toHaveBeenCalledWith(expect.any(Error))
    expect(console.log).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Error thrown from accordion'
      })
    )
  })

  it('executes onError callback on component create if specified', () => {
    document.body.classList.add('govuk-frontend-supported')
    document.body.innerHTML = '<div data-module="govuk-accordion"></div>'

    const accordionEl = document.querySelector(
      "[data-module='govuk-accordion']"
    )

    jest.mocked(GOVUKFrontend.Accordion).mockImplementation(() => {
      throw new Error('Error thrown from accordion')
    })

    const errorCallback = jest.fn((_error, _context) => {})

    initAll({
      onError: errorCallback,
      accordion: {
        rememberExpanded: true
      }
    })

    expect(console.log).not.toHaveBeenCalled()

    expect(errorCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Error thrown from accordion'
      }),
      expect.objectContaining({
        component: GOVUKFrontend.Accordion,
        config: {
          rememberExpanded: true
        },
        element: accordionEl
      })
    )
  })
})

describe('createAll', () => {
  beforeEach(() => {
    document.body.classList.add('govuk-frontend-supported')

    // Silence warnings in test output, and allow us to 'expect' them
    jest.spyOn(console, 'log').mockImplementation()
  })

  afterEach(() => {
    document.body.outerHTML = '<body></body>'
  })

  class MockComponent extends Component {
    constructor($root) {
      super($root)
      this.args = [$root]
    }

    static checkSupport() {
      Component.checkSupport()
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

  it('throws error and returns empty array if not supported', () => {
    document.body.classList.remove('govuk-frontend-supported')

    const result = createAll(MockComponent)

    expect(console.log).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'SupportError',
        message: 'GOV.UK Frontend is not supported in this browser'
      })
    )

    expect(result).toStrictEqual([])
  })

  it('executes specified onError callback and returns empty array if not supported', () => {
    document.body.classList.remove('govuk-frontend-supported')

    const errorCallback = jest.fn((_error, _context) => {})

    const result = createAll(
      MockComponent,
      { attribute: 'random' },
      { onError: errorCallback }
    )

    expect(console.log).not.toHaveBeenCalled()

    expect(errorCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'SupportError',
        message: 'GOV.UK Frontend is not supported in this browser'
      }),
      expect.objectContaining({
        component: MockComponent,
        config: { attribute: 'random' }
      })
    )

    expect(result).toStrictEqual([])
  })

  it('executes overloaded checkSupport of component', () => {
    const componentRoot = document.createElement('div')
    componentRoot.setAttribute('data-module', 'mock-component')
    document.body.appendChild(componentRoot)

    const checkSupportMock = jest.spyOn(MockComponent, 'checkSupport')

    const result = createAll(MockComponent)

    expect(checkSupportMock).toHaveBeenCalled()
    expect(result).toStrictEqual([expect.any(MockComponent)])
  })

  it('returns empty array if overloaded checkSupport of component throws error', () => {
    const componentRoot = document.createElement('div')
    componentRoot.setAttribute('data-module', 'mock-component')
    document.body.appendChild(componentRoot)

    const checkSupportMock = jest.fn(() => {
      throw Error('Mock error')
    })

    class MockComponentWithCheckSupport extends MockComponent {
      static checkSupport() {
        return checkSupportMock()
      }
    }

    const result = createAll(MockComponentWithCheckSupport)
    expect(checkSupportMock).toHaveBeenCalled()
    expect(result).toStrictEqual([])
    expect(console.log).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Mock error'
      })
    )
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

  describe('when a configuration is passed', () => {
    it('initialises a component, passing the component root and config', () => {
      const componentRoot = document.createElement('div')
      componentRoot.setAttribute('data-module', 'mock-component')
      document.body.appendChild(componentRoot)

      const result = createAll(MockComponent, {
        __test: true
      })

      expect(result).toStrictEqual([expect.any(MockComponent)])

      expect(result[0].args).toStrictEqual([
        componentRoot,
        {
          __test: true
        }
      ])
    })
  })

  describe('when a $scope is passed as third parameter', () => {
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

    it('only initialises components within that scope if scope passed as options property', () => {
      document.body.innerHTML = `
        <div data-module="mock-component"></div>
        <div class="not-in-scope">
          <div data-module="mock-component"></div>
        </div>'
        <div class="my-scope">
          <div data-module="mock-component"></div>
        </div>`

      const result = createAll(MockComponent, undefined, {
        onError: (e, x) => {},
        scope: document.querySelector('.my-scope')
      })

      expect(result).toStrictEqual([expect.any(MockComponent)])

      expect(result[0].args).toStrictEqual([
        document.querySelector('.my-scope [data-module="mock-component"]')
      ])
    })

    it('returns an empty array when scope is null and logs error to the console', () => {
      document.body.innerHTML = `
        <div data-module="mock-component"></div>
        <div class="not-in-scope">
          <div data-module="mock-component"></div>
        </div>'
        <div class="my-scope">
          <div data-module="mock-component"></div>
        </div>`

      // Silence warnings in test output, and allow us to 'expect' them
      jest.spyOn(global.console, 'log').mockImplementation()

      const result = createAll(
        MockComponent,
        undefined,
        document.querySelector('.unknown-scope')
      )

      expect(global.console.log).toHaveBeenCalledWith(expect.any(ElementError))
      expect(global.console.log).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'ElementError',
          message: `${MockComponent.moduleName}: Scope element (\`$scope\`) not found`
        })
      )

      expect(result).toStrictEqual([])
    })

    it('returns an empty array when scope as options property is null and logs error to the console', () => {
      document.body.innerHTML = `
        <div data-module="mock-component"></div>
        <div class="not-in-scope">
          <div data-module="mock-component"></div>
        </div>'
        <div class="my-scope">
          <div data-module="mock-component"></div>
        </div>`

      // Silence warnings in test output, and allow us to 'expect' them
      jest.spyOn(global.console, 'log').mockImplementation()

      const result = createAll(MockComponent, undefined, {
        scope: document.querySelector('.unknown-scope')
      })

      expect(global.console.log).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'ElementError',
          message: `${MockComponent.moduleName}: Scope element (\`$scope\`) not found`
        })
      )

      expect(result).toStrictEqual([])
    })

    it('executes specified onError callback and returns empty array when scope as options property is null', () => {
      document.body.innerHTML = `
        <div data-module="mock-component"></div>
        <div class="not-in-scope">
          <div data-module="mock-component"></div>
        </div>'
        <div class="my-scope">
          <div data-module="mock-component"></div>
        </div>`

      const errorCallback = jest.fn((_error, _context) => {})

      // Silence warnings in test output, and allow us to 'expect' them
      jest.spyOn(global.console, 'log').mockImplementation()

      const result = createAll(
        MockComponent,
        { attribute: 'random' },
        {
          scope: document.querySelector('.unknown-scope'),
          onError: errorCallback
        }
      )

      expect(global.console.log).not.toHaveBeenCalled()

      expect(errorCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'ElementError',
          message: `${MockComponent.moduleName}: Scope element (\`$scope\`) not found`
        }),
        expect.objectContaining({
          component: MockComponent,
          config: { attribute: 'random' }
        })
      )

      expect(result).toStrictEqual([])
    })
  })

  describe('when components throw errors', () => {
    class MockComponentThatErrors extends MockComponent {
      constructor($root) {
        super($root)
        if ($root.hasAttribute('data-boom')) {
          throw new Error('Error thrown from constructor')
        }
      }
    }

    it('executes callback if specified as part of options object', () => {
      document.body.innerHTML = `<div data-module="mock-component" data-boom></div>`

      const errorCallback = jest.fn((error, context) => {
        console.log(error)
        console.log(context)
      })

      expect(() => {
        createAll(
          MockComponentThatErrors,
          { attribute: 'random' },
          { onError: errorCallback }
        )
      }).not.toThrow()

      expect(errorCallback).toHaveBeenCalled()

      expect(console.log).toHaveBeenCalledWith(expect.any(Error))
      expect(console.log).toHaveBeenCalledWith(
        expect.objectContaining({
          component: MockComponentThatErrors,
          config: { attribute: 'random' },
          element: document.querySelector('[data-module="mock-component"]')
        })
      )
    })

    it('executes callback if specified as function', () => {
      document.body.innerHTML = `<div data-module="mock-component" data-boom></div>`

      const errorCallback = jest.fn((error, context) => {
        console.log(error)
        console.log(context)
      })

      expect(() => {
        createAll(
          MockComponentThatErrors,
          { attribute: 'random' },
          errorCallback
        )
      }).not.toThrow()

      expect(errorCallback).toHaveBeenCalled()

      expect(console.log).toHaveBeenCalledWith(expect.any(Error))
      expect(console.log).toHaveBeenCalledWith(
        expect.objectContaining({
          component: MockComponentThatErrors,
          config: { attribute: 'random' },
          element: document.querySelector('[data-module="mock-component"]')
        })
      )
    })

    it('catches errors thrown by components and logs them to the console', () => {
      document.body.innerHTML = `<div data-module="mock-component" data-boom></div>`

      expect(() => {
        createAll(MockComponentThatErrors)
      }).not.toThrow()

      expect(console.log).toHaveBeenCalledWith(expect.any(Error))
      expect(console.log).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Error thrown from constructor'
        })
      )
    })

    it('catches errors thrown by components and logs them to the console, when scope is passed', () => {
      document.body.innerHTML = `
        <div data-module="mock-component"></div>
        <div class="not-in-scope">
          <div data-module="mock-component"></div>
        </div>
        <div class="my-scope">
          <div data-module="mock-component" data-boom></div>
        </div>`

      // Silence warnings in test output, and allow us to 'expect' them
      jest.spyOn(global.console, 'log').mockImplementation()

      expect(() => {
        createAll(
          MockComponentThatErrors,
          undefined,
          document.querySelector('.my-scope')
        )
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
