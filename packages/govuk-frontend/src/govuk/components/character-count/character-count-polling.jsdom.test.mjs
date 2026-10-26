import { within } from '@testing-library/dom'

import { CharacterCount } from './character-count.mjs'

describe('Character count polling', () => {
  /** @type {HTMLElement} */
  let $root
  /** @type {HTMLTextAreaElement} */
  let $textarea

  beforeEach(() => {
    jest.useFakeTimers()
    document.body.classList.add('govuk-frontend-supported')
    document.body.innerHTML = `
      <div data-module="govuk-character-count">
        <textarea class="govuk-js-character-count" id="description"></textarea>
        <div id="description-info"></div>
      </div>`
    $root = /** @type {HTMLElement} */ (document.body.firstElementChild)
    $textarea = within($root).getByRole('textbox')
    jest.spyOn(console, 'warn').mockImplementation()
  })

  afterEach(() => {
    $textarea.blur()
    jest.clearAllTimers()
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  /**
   * @param {string} message - Expected counter text
   */
  function expectMessages(message) {
    expect(
      $root.querySelector('.govuk-character-count__status')
    ).toHaveTextContent(message)
    expect(
      $root.querySelector('.govuk-character-count__sr-status')
    ).toHaveTextContent(message)
  }

  /** @type {{ name: string, config: CharacterCountConfig, value: string, message: string }[]} */
  const cases = [
    {
      name: 'length',
      config: { maxlength: 10 },
      value: 'hello',
      message: 'You have 5 characters remaining'
    },
    {
      name: 'graphemes',
      config: { maxlength: 10, countType: 'characters' },
      value: '👨‍👩‍👧‍👦',
      message: 'You have 9 characters remaining'
    },
    {
      name: 'words',
      config: { maxlength: 10, countType: 'words' },
      value: 'hello world',
      message: 'You have 8 words remaining'
    },
    {
      name: 'legacy words',
      config: { maxwords: 10 },
      value: 'hello world',
      message: 'You have 8 words remaining'
    }
  ]

  it.each(cases)(
    'recounts $name when the focused value changes without an input event',
    ({ config, value, message }) => {
      // Speech recognition can change the value without dispatching input events.
      // eslint-disable-next-line no-new
      new CharacterCount($root, config)
      $textarea.focus()
      $textarea.value = value
      jest.advanceTimersByTime(1000)
      expectMessages(message)
    }
  )

  it('updates threshold and error states after event-free edits and clearing', () => {
    // eslint-disable-next-line no-new
    new CharacterCount($root, { maxlength: 10, threshold: 50 })
    $textarea.focus()
    $textarea.value = 'elevenchars'
    jest.advanceTimersByTime(1000)
    expectMessages('You have 1 character too many')
    expect($textarea).toHaveClass('govuk-textarea--error')
    expect(
      $root.querySelector('.govuk-character-count__status')
    ).not.toHaveClass('govuk-character-count__message--disabled')
    expect(
      $root.querySelector('.govuk-character-count__sr-status')
    ).not.toHaveAttribute('aria-hidden')

    $textarea.value = ''
    jest.advanceTimersByTime(1000)
    expectMessages('You have 10 characters remaining')
    expect($textarea).not.toHaveClass('govuk-textarea--error')
    expect($root.querySelector('.govuk-character-count__status')).toHaveClass(
      'govuk-character-count__message--disabled'
    )
    expect(
      $root.querySelector('.govuk-character-count__sr-status')
    ).toHaveAttribute('aria-hidden', 'true')
  })

  it('does not recount unchanged values on later polling ticks', () => {
    const component = new CharacterCount($root, { maxlength: 10 })
    // @ts-expect-error Method 'updateCount' is private
    const updateCount = jest.spyOn(component, 'updateCount')
    $textarea.focus()
    $textarea.value = 'hello'
    jest.advanceTimersByTime(3000)
    expectMessages('You have 5 characters remaining')
    expect(updateCount).toHaveBeenCalledTimes(1)
  })

  it('stops polling on blur and resumes when focused again', () => {
    // eslint-disable-next-line no-new
    new CharacterCount($root, { maxlength: 10 })
    $textarea.focus()
    $textarea.value = 'hello'
    jest.advanceTimersByTime(1000)
    $textarea.blur()
    $textarea.value = 'world!'
    jest.advanceTimersByTime(1000)
    expectMessages('You have 5 characters remaining')
    $textarea.focus()
    jest.advanceTimersByTime(1000)
    expectMessages('You have 4 characters remaining')
  })

  it('still defers screen-reader updates until typing has paused', () => {
    // eslint-disable-next-line no-new
    new CharacterCount($root, { maxlength: 10 })
    $textarea.focus()
    jest.advanceTimersByTime(750)
    $textarea.value = 'hello'
    $textarea.dispatchEvent(new Event('input'))
    expect(
      $root.querySelector('.govuk-character-count__status')
    ).toHaveTextContent('You have 5 characters remaining')
    jest.advanceTimersByTime(250)
    expect(
      $root.querySelector('.govuk-character-count__sr-status')
    ).toHaveTextContent('You have 10 characters remaining')
    jest.advanceTimersByTime(1000)
    expectMessages('You have 5 characters remaining')
  })
})

/**
 * @import { CharacterCountConfig } from './character-count.mjs'
 */
