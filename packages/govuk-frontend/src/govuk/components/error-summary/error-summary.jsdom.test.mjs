/* eslint-disable no-new */

import { ErrorSummary } from './error-summary.mjs'

describe('Error summary links containing HTML', () => {
  beforeEach(() => {
    document.body.classList.add('govuk-frontend-supported')
    document.body.innerHTML = `
      <div data-module="govuk-error-summary">
        <a href="#name"><strong>Enter <span>your name</span></strong></a>
        <p>Other content</p>
      </div>
      <label for="name">Your name</label>
      <input id="name">`
    new ErrorSummary(document.querySelector('[data-module]'), {
      disableAutoFocus: true
    })
  })

  it.each(['a', 'strong', 'span'])(
    'handles a click on %s as a click on its link',
    (selector) => {
      const $label = document.querySelector('label')
      const scrollIntoView = jest.fn()
      Object.assign($label, { scrollIntoView })
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
      document.querySelector(selector)?.dispatchEvent(event)

      expect(scrollIntoView).toHaveBeenCalledTimes(1)
      expect(document.getElementById('name')).toHaveFocus()
      expect(event.defaultPrevented).toBe(true)
    }
  )

  it.each(['#missing', '#unlabelled', '/another-page'])(
    'does not intercept a nested click when href is %s',
    (href) => {
      document.querySelector('a')?.setAttribute('href', href)
      document.body.insertAdjacentHTML('beforeend', '<input id="unlabelled">')
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
      document.querySelector('span')?.dispatchEvent(event)

      expect(event.defaultPrevented).toBe(false)
      expect(document.getElementById('name')).not.toHaveFocus()
      expect(document.getElementById('unlabelled')).not.toHaveFocus()
    }
  )

  it('does not intercept a click on content outside a link', () => {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true
    })
    document.querySelector('p')?.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(false)
    expect(document.getElementById('name')).not.toHaveFocus()
  })
})
