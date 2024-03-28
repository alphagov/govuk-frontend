const navActiveClass = 'govuk-navigation--active'
const navMenuButtonActiveClass = 'govuk-header__menu-button--open'
const subNavActiveClass = 'govuk-navigation__subnav--active'
// This one has the query dot at the beginning because it's only ever used in querySelector calls
const subNavJSClass = '.js-govuk-navigation__subnav'

/**
 * Website navigation
 */
class Navigation {
  /**
   * @param {Document} $module - HTML document
   */
  constructor($module) {
    if (
      !($module instanceof Document) ||
      !document.body.classList.contains('govuk-frontend-supported')
    ) {
      return this
    }

    this.$module = $module

    const $nav = this.$module.querySelector('.js-govuk-navigation')
    const $navToggler = this.$module.querySelector(
      '.js-govuk-navigation__toggler'
    )
    const $navButtons = this.$module.querySelectorAll(
      '.js-govuk-navigation__button'
    )
    const $navLinks = this.$module.querySelectorAll(
      '.js-govuk-navigation__link'
    )

    if (
      !($nav instanceof HTMLElement) ||
      !($navToggler instanceof HTMLElement) ||
      !$navButtons.length ||
      !$navLinks.length
    ) {
      return this
    }

    this.$nav = $nav
    this.$navToggler = $navToggler
    this.$navButtons = $navButtons
    this.$navLinks = $navLinks

    // Save the opened/closed state for the nav in memory so that we can accurately maintain state when the screen is changed from small to big and back to small
    this.mobileNavOpen = false

    // A global const for storing a matchMedia instance which we'll use to detect when a screen size change hgovukens
    // Set the matchMedia to the govuk-frontend tablet breakpoint
    this.mql = window.matchMedia('(min-width: 40.0625em)')

    // MediaQueryList.addEventListener isn't supported by Safari < 14 so we need
    // to be able to fall back to the deprecated MediaQueryList.addListener
    if ('addEventListener' in this.mql) {
      this.mql.addEventListener('change', () => this.setHiddenStates())
    } else {
      // @ts-expect-error Property 'addListener' does not exist
      this.mql.addListener(() => this.setHiddenStates())
    }

    this.setHiddenStates()
    this.setInitialAriaStates()
    this.bindUIEvents()
  }

  /**
   * Set hidden states
   *
   * Checks if the saved window size has changed between now and when it was last recorded (on load and on viewport width changes)
   * Regovuklies hidden attributes based on if the viewport has changed from big to small or vice versa
   * Saves the new window size
   */
  setHiddenStates() {
    if (!this.mql.matches) {
      if (!this.mobileNavOpen) {
        this.$nav.setAttribute('hidden', '')
      }

      this.$navLinks.forEach(($navLink) => {
        $navLink.setAttribute('hidden', '')
      })

      this.$navButtons.forEach(($navButton) => {
        $navButton.removeAttribute('hidden')
      })

      this.$navToggler.removeAttribute('hidden')
    } else {
      this.$nav.removeAttribute('hidden')

      this.$navLinks.forEach(($navLink) => {
        $navLink.removeAttribute('hidden')
      })

      this.$navButtons.forEach(($navButton) => {
        $navButton.setAttribute('hidden', '')
      })

      this.$navToggler.setAttribute('hidden', '')
    }
  }

  /**
   * Set initial ARIA states
   */
  setInitialAriaStates() {
    this.$navToggler.setAttribute('aria-expanded', 'false')

    this.$navButtons.forEach(($button, index) => {
      const $nextSubNav = $button.parentElement.querySelector(subNavJSClass)

      if ($nextSubNav) {
        const subNavTogglerId = `js-mobile-nav-subnav-toggler-${index}`
        const nextSubNavId = `js-mobile-nav__subnav-${index}`

        $nextSubNav.setAttribute('id', nextSubNavId)
        $button.setAttribute('id', subNavTogglerId)
        $button.setAttribute(
          'aria-expanded',
          $nextSubNav.hasAttribute('hidden') ? 'false' : 'true'
        )
        $button.setAttribute('aria-controls', nextSubNavId)
      }
    })
  }

  /**
   * Bind UI events
   */
  bindUIEvents() {
    this.$navToggler.addEventListener('click', () => {
      if (this.mobileNavOpen) {
        this.$nav.classList.remove(navActiveClass)
        this.$navToggler.classList.remove(navMenuButtonActiveClass)
        this.$nav.setAttribute('hidden', '')

        this.$navToggler.setAttribute('aria-expanded', 'false')

        this.mobileNavOpen = false
      } else {
        this.$nav.classList.add(navActiveClass)
        this.$navToggler.classList.add(navMenuButtonActiveClass)
        this.$nav.removeAttribute('hidden')

        this.$navToggler.setAttribute('aria-expanded', 'true')

        this.mobileNavOpen = true
      }
    })

    this.$navButtons.forEach(($button) => {
      $button.addEventListener('click', () => {
        const $nextSubNav = $button.parentElement.querySelector(subNavJSClass)

        if ($nextSubNav) {
          if ($nextSubNav.hasAttribute('hidden')) {
            $nextSubNav.classList.add(subNavActiveClass)

            $nextSubNav.removeAttribute('hidden')
            $button.setAttribute('aria-expanded', 'true')
          } else {
            $nextSubNav.classList.remove(subNavActiveClass)

            $nextSubNav.setAttribute('hidden', '')
            $button.setAttribute('aria-expanded', 'false')
          }
        }
      })
    })
  }
}

export default Navigation
