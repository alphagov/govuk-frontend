import { GOVUKFrontendError, SupportError } from './index.mjs'

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
    it('provides meaningfull feedback to users', () => {
      expect(new SupportError().message).toBe(
        'GOV.UK Frontend is not supported in this browser'
      )
    })
  })
})
