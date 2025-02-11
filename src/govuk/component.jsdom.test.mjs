import { Component } from './component.mjs'
import { SupportError } from './errors/index.mjs'

describe('Component', () => {
  describe('checkSupport()', () => {
    beforeEach(() => {
      // Jest does not tidy the JSDOM document between tests
      // so we need to take care of that ourselves
      document.documentElement.innerHTML = ''
    })

    describe('default implementation', () => {
      class ServiceComponent extends Component {
        static moduleName = 'app-service-component'
      }

      it('Makes initialisation throw if GOV.UK Frontend is not supported', () => {
        expect(() => new ServiceComponent(document.body)).toThrow(SupportError)
      })

      it('Allows initialisation if GOV.UK Frontend is supported', () => {
        document.body.classList.add('govuk-frontend-supported')

        expect(() => new ServiceComponent(document.body)).not.toThrow()
      })
    })

    describe('when overriden', () => {
      it('Allows child classes to define their own condition for support', () => {
        class ServiceComponent extends Component {
          static moduleName = 'app-service-component'

          static checkSupport() {
            throw new Error('Custom error')
          }
        }

        // Use the message rather than the class as `SupportError` extends `Error`
        expect(() => new ServiceComponent(document.body)).toThrow(
          'Custom error'
        )
      })
    })
  })
})
