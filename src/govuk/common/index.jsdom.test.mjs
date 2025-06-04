import { outdent } from 'outdent'

import { isSupported, getFragmentFromUrl, getBreakpoint } from './index.mjs'

describe('Common JS utilities', () => {
  describe('isSupported', () => {
    beforeEach(() => {
      // Jest does not tidy the JSDOM document between tests
      // so we need to take care of that ourselves
      document.documentElement.innerHTML = ''
    })

    it('returns true if the govuk-frontend-supported class is set', () => {
      document.body.classList.add('govuk-frontend-supported')

      expect(isSupported(document.body)).toBe(true)
    })

    it('returns false if the govuk-frontend-supported class is not set', () => {
      expect(isSupported(document.body)).toBe(false)
    })

    it('returns false when `document.body` is not set', () => {
      // For example, running `initAll()` in `<head>` without `type="module"`
      // will see support checks run when document.body is still `null`
      expect(isSupported(null)).toBe(false)
    })
  })

  describe('getFragmentFromUrl', () => {
    it.each([
      {
        url: 'https://www.gov.uk/#content',
        fragment: 'content'
      },
      {
        url: 'https://www.gov.uk/example/#content',
        fragment: 'content'
      },
      {
        url: 'https://www.gov.uk/example/?keywords=123#content',
        fragment: 'content'
      },
      {
        url: '/#content',
        fragment: 'content'
      },
      {
        url: '/example/#content',
        fragment: 'content'
      },
      {
        url: '/?keywords=123#content',
        fragment: 'content'
      },
      {
        url: '#content',
        fragment: 'content'
      },
      {
        url: '/',
        fragment: undefined
      },
      {
        url: '',
        fragment: undefined
      }
    ])("returns '$fragment' for '$url'", ({ url, fragment }) => {
      expect(getFragmentFromUrl(url)).toBe(fragment)
    })
  })

  describe('getBreakpoint', () => {
    beforeAll(() => {
      // Reset the state of the DOM to cleanup after other tests
      document.documentElement.innerHTML = ''

      const stylesheet = document.createElement('style')
      stylesheet.innerHTML = outdent`
        :root {
          --govuk-breakpoint-mobile: 40em;
          --govuk-breakpoint-tablet: 80em;
        }

        body {
          --govuk-breakpoint-tablet: 90em;
        }
      `
      document.body.appendChild(stylesheet)
    })

    it('returns the breakpoint value if it exists', () => {
      expect(getBreakpoint('mobile')).toEqual({
        property: '--govuk-breakpoint-mobile',
        value: '40em'
      })
    })

    it('returns the value as set on the HTML (root) element', () => {
      expect(getBreakpoint('tablet')).toEqual({
        property: '--govuk-breakpoint-tablet',
        value: '80em'
      })
    })

    it('returns an undefined value if the breakpoint does not exist', () => {
      expect(getBreakpoint('giant-video-wall')).toEqual({
        property: '--govuk-breakpoint-giant-video-wall',
        value: undefined
      })
    })
  })
})
