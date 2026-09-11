import { ElementError } from '../../errors/index.mjs'

import { SkipLink } from './skip-link.mjs'

describe('SkipLink', () => {
  beforeEach(() => {
    // Jest does not tidy the JSDOM document between tests
    // so we need to take care of that ourselves
    document.documentElement.innerHTML = ''
    document.body.classList.add('govuk-frontend-supported')
  })

  describe('errors at instantiation', () => {
    it('throws when the href does not contain a hash', () => {
      const href = window.location.pathname
      document.body.innerHTML = `<a class="govuk-skip-link" href="${href}">Skip to main content</a>`

      expect(
        () => new SkipLink(document.querySelector('.govuk-skip-link'))
      ).toThrow(
        new ElementError(
          `govuk-skip-link: Target link (\`href="${href}"\`) hash fragment not found`
        )
      )
    })
  })
})
