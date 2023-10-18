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
