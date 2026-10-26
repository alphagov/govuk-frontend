import { Tabs } from './tabs.mjs'

describe('Tabs history after selecting the current tab', () => {
  const matchMedia = window.matchMedia
  /** @type {HTMLElement} */
  let $root
  /** @type {Tabs} */
  let tabs

  beforeEach(() => {
    document.body.classList.add('govuk-frontend-supported')
    document.body.innerHTML = `
      <div data-module="govuk-tabs">
        <ul class="govuk-tabs__list">
          <li class="govuk-tabs__list-item"><a class="govuk-tabs__tab" href="#one">One</a></li>
          <li class="govuk-tabs__list-item"><a class="govuk-tabs__tab" href="#two">Two</a></li>
        </ul>
        <section class="govuk-tabs__panel" id="one">First panel</section>
        <section class="govuk-tabs__panel" id="two">Second panel</section>
      </div>`
    $root = /** @type {HTMLElement} */ (document.body.firstElementChild)
    const style = document.documentElement.style
    style.setProperty('--govuk-breakpoint-tablet', '40.0625em')
    jest.spyOn(window, 'getComputedStyle').mockReturnValue(style)
    window.matchMedia = jest.fn().mockReturnValue(
      /** @type {unknown} */ ({
        matches: true,
        addEventListener: jest.fn()
      })
    )
    window.history.replaceState(null, '', '#two')
    tabs = new Tabs($root)
  })

  afterEach(() => {
    // @ts-expect-error - Remove the component event handlers after each test
    tabs.teardown()
    window.matchMedia = matchMedia
    jest.restoreAllMocks()
    window.history.replaceState(null, '', '/')
  })

  /**
   * @param {string} id - Tab panel identifier
   */
  function expectSelected(id) {
    expect($root.querySelector(`[href="#${id}"]`)).toHaveAttribute(
      'aria-selected',
      'true'
    )
    expect(document.getElementById(id)).not.toHaveClass(
      'govuk-tabs__panel--hidden'
    )
  }

  it.each([1, 3])(
    'handles the next hash change after %i clicks on the selected tab',
    (clicks) => {
      const $currentTab = /** @type {HTMLAnchorElement} */ (
        $root.querySelector('[href="#two"]')
      )
      for (let i = 0; i < clicks; i++) {
        $currentTab.click()
      }
      window.history.replaceState(null, '', '#one')
      window.dispatchEvent(new HashChangeEvent('hashchange'))
      expectSelected('one')
      expect(document.getElementById('two')).toHaveClass(
        'govuk-tabs__panel--hidden'
      )
    }
  )

  it('still changes the hash when another tab is selected', () => {
    const $otherTab = /** @type {HTMLAnchorElement} */ (
      $root.querySelector('[href="#one"]')
    )
    $otherTab.click()
    expect(window.location.hash).toBe('#one')
    expectSelected('one')
  })

  it('still sets a hash when the current panel has no URL fragment', () => {
    window.history.replaceState(null, '', '/')
    const $currentTab = /** @type {HTMLAnchorElement} */ (
      $root.querySelector('[href="#two"]')
    )
    $currentTab.click()
    expect(window.location.hash).toBe('#two')
    expectSelected('two')
  })
})
