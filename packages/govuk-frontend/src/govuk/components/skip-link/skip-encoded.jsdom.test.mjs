/* eslint-disable no-new */

import { SkipLink } from './skip-link.mjs'

describe('Skip link encoded fragments', () => {
  beforeEach(() => {
    document.body.classList.add('govuk-frontend-supported')
  })

  it.each([
    ['caf\u00e9', '#caf%C3%A9'],
    ['caf\u00e9', '#caf\u00e9'],
    ['section#one', '#section%23one'],
    ['100%', '#100%25'],
    ['bad%FF', '#bad%FF'],
    ['main-content', '#main%2Dcontent'],
    ['main-content', '#main-content']
  ])('focuses %s using href %s', (id, href) => {
    document.body.innerHTML = `<a data-module="govuk-skip-link" href="${href}">Skip</a><main id="${id}">Content</main>`
    const $link = document.querySelector('a')
    new SkipLink($link)
    $link.click()
    expect(document.getElementById(id)).toHaveFocus()
    expect(document.activeElement).toHaveClass(
      'govuk-skip-link-focused-element'
    )
    const $focused = /** @type {HTMLElement} */ (document.activeElement)
    $focused.blur()
    expect(document.getElementById(id)).not.toHaveAttribute('tabindex')
    expect(document.getElementById(id)).not.toHaveClass(
      'govuk-skip-link-focused-element'
    )
  })
  it('prefers an exact percent-encoded identifier over its decoded alternative', () => {
    document.body.innerHTML =
      '<a data-module="govuk-skip-link" href="#caf%C3%A9">Skip</a><main id="caf%C3%A9">Literal</main><main id="café">Decoded</main>'
    const $link = document.querySelector('a')
    new SkipLink($link)
    $link.click()
    expect(document.activeElement.id).toBe('caf%C3%A9')
    const $focused = /** @type {HTMLElement} */ (document.activeElement)
    $focused.blur()
  })

  it('keeps malformed missing fragments as ElementError rather than URIError', () => {
    document.body.innerHTML =
      '<a data-module="govuk-skip-link" href="#bad%FF">Skip</a>'
    expect(() => new SkipLink(document.querySelector('a'))).toThrow(
      'Target content (`id="bad%FF"`) not found'
    )
  })

  it.each(['/elsewhere#caf%C3%A9', 'https://example.org/#caf%C3%A9'])(
    'leaves external or different-page link %s alone',
    (href) => {
      document.body.innerHTML = `<a data-module="govuk-skip-link" href="${href}">Skip</a>`
      expect(() => new SkipLink(document.querySelector('a'))).not.toThrow()
    }
  )
})
