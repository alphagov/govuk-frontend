import { Accordion } from 'govuk-frontend'

import {
  ElementError,
  GOVUKFrontendError,
  InitError,
  SupportError
} from './index.mjs'

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

  describe('InitError', () => {
    it('is an instance of GOVUKFrontendError', () => {
      expect(new InitError(Accordion)).toBeInstanceOf(GOVUKFrontendError)
    })

    it('has its own name set', () => {
      expect(new InitError(Accordion).name).toBe('InitError')
    })

    it('provides feedback for modules already initialised', () => {
      expect(new InitError(Accordion).message).toBe(
        'govuk-accordion: Root element (`$root`) already initialised'
      )
    })

    it('allows a custom message to be provided', () => {
      expect(new InitError('custom message').message).toBe('custom message')
    })
  })

  describe('ElementError', () => {
    it('is an instance of GOVUKFrontendError', () => {
      expect(
        new ElementError({
          component: Accordion,
          identifier: 'Element name'
        })
      ).toBeInstanceOf(GOVUKFrontendError)
    })

    it('has its own name set', () => {
      expect(
        new ElementError({
          component: Accordion,
          identifier: 'Element name'
        }).name
      ).toBe('ElementError')
    })

    it('accepts a string and does not process it in any way', () => {
      expect(new ElementError('Complex custom error message').message).toBe(
        'Complex custom error message'
      )
    })

    describe('with component', () => {
      it('formats the message when the element is not found', () => {
        const error = new ElementError({
          component: Accordion,
          identifier: 'Element name'
        })

        expect(error).toHaveProperty(
          'message',
          `${Accordion.moduleName}: Element name not found`
        )
      })

      it('formats the message when the element is not the right type', () => {
        const $element = document.createElement('div')

        const error = new ElementError({
          element: $element,
          component: Accordion,
          identifier: 'Element name',
          expectedType: 'HTMLAnchorElement'
        })

        expect(error).toHaveProperty(
          'message',
          `${Accordion.moduleName}: Element name is not of type HTMLAnchorElement`
        )
      })
    })

    describe('without component', () => {
      it('formats the message when the element is not found', () => {
        const error = new ElementError({
          identifier: 'Element name'
        })

        expect(error).toHaveProperty('message', 'Element name not found')
      })

      it('formats the message when the element is not the right type', () => {
        const $element = document.createElement('div')

        const error = new ElementError({
          element: $element,
          identifier: 'Element name',
          expectedType: 'HTMLAnchorElement'
        })

        expect(error).toHaveProperty(
          'message',
          'Element name is not of type HTMLAnchorElement'
        )
      })
    })
  })
})
