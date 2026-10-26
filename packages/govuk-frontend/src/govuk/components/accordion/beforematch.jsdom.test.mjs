import { render } from '@govuk-frontend/lib/components'

import { Accordion } from './accordion.mjs'

/* eslint-disable no-new */

describe('Accordion beforematch ownership', () => {
  let listeners
  let addEventListener

  afterEach(() => {
    addEventListener.mockRestore()
    listeners.forEach((listener) =>
      document.removeEventListener('beforematch', listener)
    )
  })
  beforeEach(() => {
    listeners = []
    const original = document.addEventListener.bind(document)
    addEventListener = jest
      .spyOn(document, 'addEventListener')
      .mockImplementation((type, listener, options) => {
        if (type === 'beforematch') listeners.push(listener)
        original(type, listener, options)
      })
    Object.defineProperty(document, 'onbeforematch', {
      value: null,
      configurable: true
    })
    document.body.classList.add('govuk-frontend-supported')
    document.body.innerHTML = ['first', 'second']
      .map((id) =>
        render('accordion', {
          context: {
            id,
            items: [
              {
                heading: { text: id },
                content: { html: '<p>Find this text</p>' }
              }
            ]
          }
        })
      )
      .join('')
  })

  it.each([
    ['first', false],
    ['first', true],
    ['second', false],
    ['second', true]
  ])('keeps translations of %s with reverse init %s', (id, reverse) => {
    const $first = document.getElementById('first')
    const $second = document.getElementById('second')
    const roots = reverse ? [$second, $first] : [$first, $second]
    roots.forEach(($root) => {
      const prefix = $root.id === 'first' ? 'First' : 'Second'
      new Accordion($root, {
        i18n: {
          hideSection: `${prefix} hide`,
          hideSectionAriaLabel: `${prefix} hide label`
        }
      })
    })
    const $root = document.getElementById(id)
    const event = new Event('beforematch', { bubbles: true })
    $root
      .querySelector('.govuk-accordion__section-content')
      .dispatchEvent(event)
    const prefix = id === 'first' ? 'First' : 'Second'
    expect(
      $root.querySelector('.govuk-accordion__section-toggle-text')
    ).toHaveTextContent(`${prefix} hide`)
    expect(
      $root.querySelector('.govuk-accordion__section-button')
    ).toHaveAttribute('aria-label', `${id} , ${prefix} hide label`)
    const other = id === 'first' ? $second : $first
    expect(
      other.querySelector('.govuk-accordion__section-button')
    ).toHaveAttribute('aria-expanded', 'false')
    expect(other.querySelector('.govuk-accordion__show-all')).toHaveAttribute(
      'aria-expanded',
      'false'
    )
    expect($root.querySelector('.govuk-accordion__show-all')).toHaveAttribute(
      'aria-expanded',
      'true'
    )
  })
})
