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
    it('is an instance of GOVUKFrontendError', () => {
      expect(new SupportError()).toBeInstanceOf(GOVUKFrontendError)
    })
    it('has its own name set', () => {
      expect(new SupportError().name).toBe('SupportError')
    })
    it('provides meaningful feedback to users', () => {
      expect(new SupportError().message).toBe(
        'GOV.UK Frontend is not supported in this browser'
      )
    })
  })

  describe('ElementError', () => {
    it('is an instance of GOVUKFrontendError', () => {
      expect(
        new ElementError('variableName', {
          componentName: 'Component name'
        })
      ).toBeInstanceOf(GOVUKFrontendError)
    })
    it('has its own name set', () => {
      expect(
        new ElementError('variableName', {
          componentName: 'Component name'
        }).name
      ).toBe('ElementError')
    })
    it('formats the message when the element is not found', () => {
      expect(
        new ElementError('variableName', {
          componentName: 'Component name'
        }).message
      ).toBe('Component name: variableName not found')
    })
    it('formats the message when the element is not the right type', () => {
      const element = document.createElement('div')

      expect(
        new ElementError('variableName', {
          componentName: 'Component name',
          element,
          expectedType: 'HTMLAnchorElement'
        }).message
      ).toBe('Component name: variableName is not of type HTMLAnchorElement')
    })
  })
})
