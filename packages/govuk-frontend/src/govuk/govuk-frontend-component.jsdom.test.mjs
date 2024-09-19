import { SupportError } from './errors/index.mjs'
import { GOVUKFrontendComponent } from './govuk-frontend-component.mjs'

describe('GOVUKFrontendComponent', () => {
  describe('isSupported()', () => {
    beforeEach(() => {
      // Jest does not tidy the JSDOM document between tests
      // so we need to take care of that ourselves
      document.documentElement.innerHTML = ''
    })

    describe('default implementation', () => {
      class ServiceComponent extends GOVUKFrontendComponent {
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
        class ServiceComponent extends GOVUKFrontendComponent {
          static moduleName = 'app-service-component'

          static isSupported() {
            return true
          }
        }

        expect(() => new ServiceComponent(document.body)).not.toThrow(
          SupportError
        )
      })
    })
  })
})
