import { ElementError, GOVUKFrontendError, SupportError } from './index.mjs'

describe('errors', () => {
  describe('GOVUKFrontendError', () => {
    it('allows subclasses to set a custom name', () => {
      class CustomError extends GOVUKFrontendError {
        name = 'CustomName'
      }

      expect(new CustomError().name).toBe('CustomName')
    })
  })

  describe('SupportError', () => {
    beforeEach(() => {
      // JSDOM hasn't yet implemented `noModule`, so we have to mock this
      window.HTMLScriptElement.prototype.noModule = true
    })

    it('is an instance of GOVUKFrontendError', () => {
      expect(new SupportError(document.body)).toBeInstanceOf(GOVUKFrontendError)
    })

    it('has its own name set', () => {
      expect(new SupportError(document.body).name).toBe('SupportError')
    })

    it('provides feedback regarding browser support', () => {
      delete window.HTMLScriptElement.prototype.noModule
      expect(new SupportError(document.body).message).toBe(
        'GOV.UK Frontend is not supported in this browser'
      )
    })

    it('provides feedback when <body> class is missing', () => {
      expect(new SupportError(document.body).message).toBe(
        'GOV.UK Frontend initialised without `<body class="govuk-frontend-supported">` from template `<script>` snippet'
      )
    })

    it('provides feedback when `document.body` is not set', () => {
      // For example, running `initAll()` in `<head>` without `type="module"`
      // will see support checks run when document.body is still `null`
      expect(new SupportError(null).message).toBe(
        'GOV.UK Frontend initialised without `<script type="module">`'
      )
    })
  })

  describe('ElementError', () => {
    it('is an instance of GOVUKFrontendError', () => {
      expect(
        new ElementError({
          componentName: 'Component name',
          identifier: 'variableName'
        })
      ).toBeInstanceOf(GOVUKFrontendError)
    })
    it('has its own name set', () => {
      expect(
        new ElementError({
          componentName: 'Component name',
          identifier: 'variableName'
        }).name
      ).toBe('ElementError')
    })
    it('accepts a string and does not process it in any way', () => {
      expect(new ElementError('Complex custom error message').message).toBe(
        'Complex custom error message'
      )
    })
    it('formats the message when the element is not found', () => {
      expect(
        new ElementError({
          componentName: 'Component name',
          identifier: 'variableName'
        }).message
      ).toBe('Component name: variableName not found')
    })
    it('formats the message when the element is not the right type', () => {
      const element = document.createElement('div')

      expect(
        new ElementError({
          componentName: 'Component name',
          element,
          expectedType: 'HTMLAnchorElement',
          identifier: 'variableName'
        }).message
      ).toBe('Component name: variableName is not of type HTMLAnchorElement')
    })
  })
})
