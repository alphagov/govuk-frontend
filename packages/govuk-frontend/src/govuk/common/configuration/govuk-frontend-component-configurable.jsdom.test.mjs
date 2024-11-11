import { ConfigError } from '../../errors/index.mjs'
import { GOVUKFrontendComponentConfigurable } from '../configuration.mjs'

describe('GOVUKFrontendComponentConfigurable', () => {
  beforeEach(() => {
    // Jest does not tidy the JSDOM document between tests
    // so we need to take care of that ourselves
    document.documentElement.innerHTML = ''

    // this is tested in the parent class GOVUKFrontendComponent
    // so it can be go before each test instead of it needing to
    // be added each time seperately
    document.body.classList.add('govuk-frontend-supported')
  })

  describe('throws error', () => {
    it('if no schema defined', () => {
      class ConfigurableComponent extends GOVUKFrontendComponentConfigurable {
        static moduleName = 'config-component'

        static defaults = {
          randomAttribute: 0
        }
      }

      expect(() => new ConfigurableComponent(document.body)).toThrow(
        new ConfigError(
          'config-component: Config passed as parameter into constructor but no schema defined'
        )
      )
    })

    it('if no defaults defined', () => {
      class ConfigurableComponent extends GOVUKFrontendComponentConfigurable {
        static moduleName = 'config-component'

        static schema = {
          properties: {
            randomAttribute: { type: 'number' }
          }
        }
      }

      expect(() => new ConfigurableComponent(document.body)).toThrow(
        new ConfigError(
          'config-component: Config passed as parameter into constructor but no defaults defined'
        )
      )
    })
  })

  describe('set configuration on initialisation to', () => {
    it('defaults if no configuration provided', () => {
      document.body.innerHTML = `
        <div id="test-component"></div>
      `

      class ConfigurableComponent extends GOVUKFrontendComponentConfigurable {
        static moduleName = 'config-component'

        static schema = {
          properties: {
            randomAttribute: { type: 'number' }
          }
        }

        static defaults = {
          randomAttribute: 0
        }
      }

      const testComponent = document.querySelector('#test-component')

      const configComponent = new ConfigurableComponent(testComponent)

      expect(configComponent._config).toMatchObject({ randomAttribute: 0 })
    })

    it('dataset of root', () => {
      document.body.innerHTML = `
        <div id="test-component" data-random-attribute="42"></div>
      `

      class ConfigurableComponent extends GOVUKFrontendComponentConfigurable {
        static moduleName = 'config-component'

        static schema = {
          properties: {
            randomAttribute: { type: 'number' }
          }
        }

        static defaults = {
          randomAttribute: 0
        }
      }

      const testComponent = document.querySelector('#test-component')

      const configComponent = new ConfigurableComponent(testComponent)

      expect(configComponent._config).toMatchObject({ randomAttribute: 42 })
    })

    it('configuration object from class initialisation', () => {
      document.body.innerHTML = `
        <div id="test-component"></div>
      `

      class ConfigurableComponent extends GOVUKFrontendComponentConfigurable {
        static moduleName = 'config-component'

        static schema = {
          properties: {
            randomAttribute: { type: 'number' }
          }
        }

        static defaults = {
          randomAttribute: 0
        }
      }

      const testComponent = document.querySelector('#test-component')

      const configComponent = new ConfigurableComponent(testComponent, {
        randomAttribute: 100
      })

      expect(configComponent._config).toMatchObject({ randomAttribute: 100 })
    })

    it('dataset configuration over the configuration object from class initialisation', () => {
      document.body.innerHTML = `
        <div id="test-component" data-random-attribute="12"></div>
      `

      class ConfigurableComponent extends GOVUKFrontendComponentConfigurable {
        static moduleName = 'config-component'

        static schema = {
          properties: {
            randomAttribute: { type: 'number' }
          }
        }

        static defaults = {
          randomAttribute: 0
        }
      }

      const testComponent = document.querySelector('#test-component')

      const configComponent = new ConfigurableComponent(testComponent, {
        randomAttribute: 100
      })

      expect(configComponent._config).toMatchObject({ randomAttribute: 12 })
    })
  })
})
