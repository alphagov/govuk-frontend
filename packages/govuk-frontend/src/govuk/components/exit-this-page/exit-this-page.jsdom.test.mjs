import { getExamples, render } from '@govuk-frontend/lib/components'

import { ExitThisPage } from './exit-this-page.mjs'

describe('Exit this page after history restoration', () => {
  /** @type {Awaited<ReturnType<typeof getExamples>>} */
  let examples

  /** @type {ExitThisPage} */
  let component

  /** @type {jest.SpyInstance} */
  let windowListeners

  /** @type {jest.SpyInstance} */
  let documentListeners

  /**
   * @param {string} key - Released key
   * @param {boolean} [shiftKey] - Whether Shift is held
   */
  function releaseKey(key, shiftKey = false) {
    document.dispatchEvent(new KeyboardEvent('keyup', { key, shiftKey }))
  }

  function restorePage() {
    window.dispatchEvent(
      new PageTransitionEvent('pageshow', { persisted: true })
    )
  }

  beforeAll(async () => {
    examples = await getExamples('exit-this-page')
  })

  beforeEach(() => {
    jest.useFakeTimers()
    document.body.className = 'govuk-frontend-supported'
    delete document.body.dataset.govukFrontendExitThisPageKeypress
    document.body.innerHTML = render('exit-this-page', examples.default)
    windowListeners = jest.spyOn(window, 'addEventListener')
    documentListeners = jest.spyOn(document, 'addEventListener')
    component = new ExitThisPage(document.querySelector('[data-module]'))
  })

  afterEach(() => {
    for (const [type, listener, options] of windowListeners.mock.calls) {
      window.removeEventListener(type, listener, options)
    }
    for (const [type, listener, options] of documentListeners.mock.calls) {
      document.removeEventListener(type, listener, options)
    }
    jest.restoreAllMocks()
    jest.clearAllTimers()
    jest.useRealTimers()
    document.body.innerHTML = ''
    delete document.body.dataset.govukFrontendExitThisPageKeypress
  })

  it('requires three new Shift presses after restoring a partial sequence', () => {
    // @ts-expect-error Property 'exitPage' is private
    const exit = jest.spyOn(component, 'exitPage').mockImplementation(() => {})
    releaseKey('Shift')
    releaseKey('Shift')

    restorePage()
    jest.advanceTimersByTime(6000)
    releaseKey('Shift')
    releaseKey('Shift')
    expect(exit).not.toHaveBeenCalled()

    releaseKey('Shift')
    expect(exit).toHaveBeenCalledTimes(1)
  })

  it('clears the indicator lights when the page is restored', () => {
    releaseKey('Shift')
    releaseKey('Shift')

    restorePage()

    expect(
      document.querySelector('.govuk-exit-this-page__indicator')
    ).not.toHaveClass('govuk-exit-this-page__indicator--visible')
    expect(
      document.querySelectorAll('.govuk-exit-this-page__indicator-light--on')
    ).toHaveLength(0)
  })

  it('does not carry a held modifier into the restored page', () => {
    releaseKey('A', true)
    restorePage()
    releaseKey('Shift')

    expect(document.querySelector('[role="status"]')).toHaveTextContent(
      'Shift, press 2 more times to exit.'
    )
  })

  it('leaves no shortcut or announcement timers running after restoration', () => {
    releaseKey('Shift')
    jest.advanceTimersByTime(5000)
    releaseKey('Shift')

    restorePage()

    expect(jest.getTimerCount()).toBe(0)
    // @ts-expect-error Property 'keypressTimeoutId' is private
    expect(component.keypressTimeoutId).toBeNull()
    // @ts-expect-error Property 'timeoutMessageId' is private
    expect(component.timeoutMessageId).toBeNull()
    expect(document.querySelector('[role="status"]')).toBeEmptyDOMElement()
  })

  it('still expires a new shortcut sequence after restoration', () => {
    // @ts-expect-error Property 'exitPage' is private
    const exit = jest.spyOn(component, 'exitPage').mockImplementation(() => {})
    releaseKey('Shift')
    restorePage()
    releaseKey('Shift')
    jest.advanceTimersByTime(5000)
    releaseKey('Shift')
    releaseKey('Shift')

    expect(exit).not.toHaveBeenCalled()
  })

  it('still cancels a new shortcut sequence when another key is pressed', () => {
    // @ts-expect-error Property 'exitPage' is private
    const exit = jest.spyOn(component, 'exitPage').mockImplementation(() => {})
    restorePage()
    releaseKey('Shift')
    releaseKey('A', true)
    releaseKey('Shift')
    releaseKey('Shift')
    releaseKey('Shift')

    expect(exit).not.toHaveBeenCalled()
    releaseKey('Shift')
    expect(exit).toHaveBeenCalledTimes(1)
  })
})
