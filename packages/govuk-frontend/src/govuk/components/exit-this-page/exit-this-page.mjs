import { mergeConfigs, extractConfigByNamespace } from '../../common/index.mjs'
import { normaliseDataset } from '../../common/normalise-dataset.mjs'
import { ElementError } from '../../errors/index.mjs'
import { GOVUKFrontendComponent } from '../../govuk-frontend-component.mjs'
import { I18n } from '../../i18n.mjs'

/**
 * Exit this page component
 *
 * @preserve
 */
export class ExitThisPage extends GOVUKFrontendComponent {
  /** @private */
  $module

  /**
   * @private
   * @type {ExitThisPageConfig}
   */
  config

  /** @private */
  i18n

  /** @private */
  $button

  /**
   * @private
   * @type {HTMLAnchorElement | null}
   */
  $skiplinkButton = null

  /**
   * @private
   * @type {HTMLElement | null}
   */
  $updateSpan = null

  /**
   * @private
   * @type {HTMLElement | null}
   */
  $indicatorContainer = null

  /**
   * @private
   * @type {HTMLElement | null}
   */
  $overlay = null

  /** @private */
  keypressCounter = 0

  /** @private */
  lastKeyWasModified = false

  /** @private */
  timeoutTime = 5000 // milliseconds

  // Store the timeout events so that we can clear them to avoid user keypresses overlapping
  // setTimeout returns an id that we can use to clear it with clearTimeout,
  // hence the 'Id' suffix

  /**
   * @private
   * @type {number | null}
   */
  keypressTimeoutId = null

  /**
   * @private
   * @type {number | null}
   */
  timeoutMessageId = null

  /**
   * @param {Element | null} $module - HTML element that wraps the Exit This Page button
   * @param {ExitThisPageConfig} [config] - Exit This Page config
   */
  constructor($module, config = {}) {
    super()

    if (!($module instanceof HTMLElement)) {
      throw new ElementError({
        componentName: 'Exit this page',
        element: $module,
        identifier: 'Root element (`$module`)'
      })
    }

    const $button = $module.querySelector('.govuk-exit-this-page__button')
    if (!($button instanceof HTMLAnchorElement)) {
      throw new ElementError({
        componentName: 'Exit this page',
        element: $button,
        expectedType: 'HTMLAnchorElement',
        identifier: 'Button (`.govuk-exit-this-page__button`)'
      })
    }

    this.config = mergeConfigs(
      ExitThisPage.defaults,
      config,
      normaliseDataset($module.dataset)
    )

    this.i18n = new I18n(extractConfigByNamespace(this.config, 'i18n'))
    this.$module = $module
    this.$button = $button

    const $skiplinkButton = document.querySelector(
      '.govuk-js-exit-this-page-skiplink'
    )
    if ($skiplinkButton instanceof HTMLAnchorElement) {
      this.$skiplinkButton = $skiplinkButton
    }

    this.buildIndicator()
    this.initUpdateSpan()
    this.initButtonClickHandler()

    // Check to see if this has already been done by a previous initialisation of ExitThisPage
    if (!('govukFrontendExitThisPageKeypress' in document.body.dataset)) {
      document.addEventListener('keyup', this.handleKeypress.bind(this), true)
      document.body.dataset.govukFrontendExitThisPageKeypress = 'true'
    }

    // When the page is restored after navigating 'back' in some browsers the
    // blank overlay remains present, rendering the page unusable. Here, we check
    // to see if it's present on page (re)load, and remove it if so.
    window.addEventListener('pageshow', this.resetPage.bind(this))
  }

  /**
   * Create the <span> we use for screen reader announcements.
   *
   * @private
   */
  initUpdateSpan() {
    this.$updateSpan = document.createElement('span')
    this.$updateSpan.setAttribute('role', 'status')
    this.$updateSpan.className = 'govuk-visually-hidden'

    this.$module.appendChild(this.$updateSpan)
  }

  /**
   * Create button click handlers.
   *
   * @private
   */
  initButtonClickHandler() {
    // Main EtP button
    this.$button.addEventListener('click', this.handleClick.bind(this))

    // EtP secondary link
    if (this.$skiplinkButton) {
      this.$skiplinkButton.addEventListener(
        'click',
        this.handleClick.bind(this)
      )
    }
  }

  /**
   * Create the HTML for the 'three lights' indicator on the button.
   *
   * @private
   */
  buildIndicator() {
    // Build container
    // Putting `aria-hidden` on it as it won't contain any readable information
    this.$indicatorContainer = document.createElement('div')
    this.$indicatorContainer.className = 'govuk-exit-this-page__indicator'
    this.$indicatorContainer.setAttribute('aria-hidden', 'true')

    // Create three 'lights' and place them within the container
    for (let i = 0; i < 3; i++) {
      const $indicator = document.createElement('div')
      $indicator.className = 'govuk-exit-this-page__indicator-light'
      this.$indicatorContainer.appendChild($indicator)
    }

    // Append it all to the module
    this.$button.appendChild(this.$indicatorContainer)
  }

  /**
   * Update whether the lights are visible and which ones are lit up depending on
   * the value of `keypressCounter`.
   *
   * @private
   */
  updateIndicator() {
    if (!this.$indicatorContainer) {
      return
    }

    // Show or hide the indicator container depending on keypressCounter value
    this.$indicatorContainer.classList.toggle(
      'govuk-exit-this-page__indicator--visible',
      this.keypressCounter > 0
    )

    // Turn on only the indicators we want on
    const $indicators = this.$indicatorContainer.querySelectorAll(
      '.govuk-exit-this-page__indicator-light'
    )
    $indicators.forEach(($indicator, index) => {
      $indicator.classList.toggle(
        'govuk-exit-this-page__indicator-light--on',
        index < this.keypressCounter
      )
    })
  }

  /**
   * Initiates the redirection away from the current page.
   * Includes the loading overlay functionality, which covers the current page with a
   * white overlay so that the contents are not visible during the loading
   * process. This is particularly important on slow network connections.
   *
   * @private
   */
  exitPage() {
    if (!this.$updateSpan) {
      return
    }

    this.$updateSpan.textContent = ''

    // Blank the page
    // As well as creating an overlay with text, we also set the body to hidden
    // to prevent screen reader and sequential navigation users potentially
    // navigating through the page behind the overlay during loading
    document.body.classList.add('govuk-exit-this-page-hide-content')
    this.$overlay = document.createElement('div')
    this.$overlay.className = 'govuk-exit-this-page-overlay'
    this.$overlay.setAttribute('role', 'alert')

    // we do these this way round, thus incurring a second paint, because changing
    // the element text after adding it means that screen readers pick up the
    // announcement more reliably.
    document.body.appendChild(this.$overlay)
    this.$overlay.textContent = this.i18n.t('activated')

    window.location.href = this.$button.href
  }

  /**
   * Pre-activation logic for when the button is clicked/activated via mouse or
   * pointer.
   *
   * We do this to differentiate it from the keyboard activation event because we
   * need to run `e.preventDefault` as the button or skiplink are both links and we
   * want to apply some additional logic in `exitPage` before navigating.
   *
   * @private
   * @param {MouseEvent} event - mouse click event
   */
  handleClick(event) {
    event.preventDefault()
    this.exitPage()
  }

  /**
   * Logic for the 'quick escape' keyboard sequence functionality (pressing the
   * Shift key three times without interruption, within a time limit).
   *
   * @private
   * @param {KeyboardEvent} event - keyup event
   */
  handleKeypress(event) {
    if (!this.$updateSpan) {
      return
    }

    // Detect if the 'Shift' key has been pressed. We want to only do things if it
    // was pressed by itself and not in a combination with another key—so we keep
    // track of whether the preceding keyup had shiftKey: true on it, and if it
    // did, we ignore the next Shift keyup event.
    //
    // This works because using Shift as a modifier key (e.g. pressing Shift + A)
    // will fire TWO keyup events, one for A (with e.shiftKey: true) and the other
    // for Shift (with e.shiftKey: false).
    if (
      (event.key === 'Shift' || event.keyCode === 16 || event.which === 16) &&
      !this.lastKeyWasModified
    ) {
      this.keypressCounter += 1

      // Update the indicator before the below if statement can reset it back to 0
      this.updateIndicator()

      // Clear the timeout for the keypress timeout message clearing itself
      if (this.timeoutMessageId) {
        window.clearTimeout(this.timeoutMessageId)
        this.timeoutMessageId = null
      }

      if (this.keypressCounter >= 3) {
        this.keypressCounter = 0

        if (this.keypressTimeoutId) {
          window.clearTimeout(this.keypressTimeoutId)
          this.keypressTimeoutId = null
        }

        this.exitPage()
      } else {
        if (this.keypressCounter === 1) {
          this.$updateSpan.textContent = this.i18n.t('pressTwoMoreTimes')
        } else {
          this.$updateSpan.textContent = this.i18n.t('pressOneMoreTime')
        }
      }

      this.setKeypressTimer()
    } else if (this.keypressTimeoutId) {
      // If the user pressed any key other than 'Shift', after having pressed
      // 'Shift' and activating the timer, stop and reset the timer.
      this.resetKeypressTimer()
    }

    // Keep track of whether the Shift modifier key was held during this keypress
    this.lastKeyWasModified = event.shiftKey
  }

  /**
   * Starts the 'quick escape' keyboard sequence timer.
   *
   * This can be invoked several times. We want this to be possible so that the
   * timer is restarted each time the shortcut key is pressed (e.g. the user has
   * up to n seconds between each keypress, rather than n seconds to invoke the
   * entire sequence.)
   *
   * @private
   */
  setKeypressTimer() {
    // Clear any existing timeout. This is so only one timer is running even if
    // there are multiple keypresses in quick succession.
    if (this.keypressTimeoutId) {
      window.clearTimeout(this.keypressTimeoutId)
    }

    // Set a fresh timeout
    this.keypressTimeoutId = window.setTimeout(
      this.resetKeypressTimer.bind(this),
      this.timeoutTime
    )
  }

  /**
   * Stops and resets the 'quick escape' keyboard sequence timer.
   *
   * @private
   */
  resetKeypressTimer() {
    if (!this.$updateSpan) {
      return
    }

    if (this.keypressTimeoutId) {
      window.clearTimeout(this.keypressTimeoutId)
      this.keypressTimeoutId = null
    }

    const $updateSpan = this.$updateSpan

    this.keypressCounter = 0
    $updateSpan.textContent = this.i18n.t('timedOut')

    this.timeoutMessageId = window.setTimeout(() => {
      $updateSpan.textContent = ''
    }, this.timeoutTime)

    this.updateIndicator()
  }

  /**
   * Reset the page using the EtP button
   *
   * We use this in situations where a user may re-enter a page using the browser
   * back button. In these cases, the browser can choose to restore the state of
   * the page as it was previously, including restoring the 'ghost page' overlay,
   * the announcement span having it's role set to "alert" and the keypress
   * indicator still active, leaving the page in an unusable state.
   *
   * By running this check when the page is shown, we can programatically restore
   * the page and the component to a "default" state
   *
   * @private
   */
  resetPage() {
    // If an overlay is set, remove it and reset the value
    document.body.classList.remove('govuk-exit-this-page-hide-content')

    if (this.$overlay) {
      this.$overlay.remove()
      this.$overlay = null
    }

    // Ensure the announcement span's role is status, not alert and clear any text
    if (this.$updateSpan) {
      this.$updateSpan.setAttribute('role', 'status')
      this.$updateSpan.textContent = ''
    }

    // Sync the keypress indicator lights
    this.updateIndicator()

    // If the timeouts are active, clear them
    if (this.keypressTimeoutId) {
      window.clearTimeout(this.keypressTimeoutId)
    }

    if (this.timeoutMessageId) {
      window.clearTimeout(this.timeoutMessageId)
    }
  }

  /**
   * Name for the component used when initialising using data-module attributes.
   */
  static moduleName = 'govuk-exit-this-page'

  /**
   * Exit this page default config
   *
   * @see {@link ExitThisPageConfig}
   * @constant
   * @type {ExitThisPageConfig}
   */
  static defaults = Object.freeze({
    i18n: {
      activated: 'Loading.',
      timedOut: 'Exit this page expired.',
      pressTwoMoreTimes: 'Shift, press 2 more times to exit.',
      pressOneMoreTime: 'Shift, press 1 more time to exit.'
    }
  })
}

/**
 * Exit this Page config
 *
 * @see {@link ExitThisPage.defaults}
 * @typedef {object} ExitThisPageConfig
 * @property {ExitThisPageTranslations} [i18n=ExitThisPage.defaults.i18n] - Exit this page translations
 */

/**
 * Exit this Page translations
 *
 * @see {@link ExitThisPage.defaults.i18n}
 * @typedef {object} ExitThisPageTranslations
 *
 * Messages used by the component programatically inserted text, including
 * overlay text and screen reader announcements.
 * @property {string} [activated] - Screen reader announcement for when EtP
 *   keypress functionality has been successfully activated.
 * @property {string} [timedOut] - Screen reader announcement for when the EtP
 *   keypress functionality has timed out.
 * @property {string} [pressTwoMoreTimes] - Screen reader announcement informing
 *   the user they must press the activation key two more times.
 * @property {string} [pressOneMoreTime] - Screen reader announcement informing
 *   the user they must press the activation key one more time.
 */
