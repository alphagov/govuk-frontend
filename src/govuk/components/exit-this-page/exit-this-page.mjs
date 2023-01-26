/* eslint-disable es-x/no-function-prototype-bind -- Polyfill imported */

import { nodeListForEach } from '../../common.mjs'
import '../../vendor/polyfills/Element/prototype/classList.mjs'
import '../../vendor/polyfills/Element/prototype/dataset.mjs'
import '../../vendor/polyfills/Function/prototype/bind.mjs'

/**
 * JavaScript functionality for the Exit this Page component
 *
 * @class
 * @param {HTMLElement} $module - HTML element that wraps the EtP button
 */
function ExitThisPage ($module) {
  this.$module = $module
  this.$button = $module.querySelector('.govuk-exit-this-page__button')
  this.$updateSpan = null
  this.$indicatorContainer = null
  this.$overlay = null
  this.escCounter = 0
  this.lastKeyWasModified = false
  this.timeoutTime = 5000 // milliseconds

  // Store the timeout events so that we can clear them to avoid user keypresses overlapping
  // setTimeout returns an id that we can use to clear it with clearTimeout,
  // hence the 'Id' suffix
  this.keypressTimeoutId = null
  this.timeoutMessageId = null
}

/**
 * Create the <span> we use for screen reader announcements.
 */
ExitThisPage.prototype.initUpdateSpan = function () {
  this.$updateSpan = document.createElement('span')
  this.$updateSpan.setAttribute('role', 'status')
  this.$updateSpan.className = 'govuk-visually-hidden'

  this.$module.appendChild(this.$updateSpan)
}

/**
 * Create button click handler.
 */
ExitThisPage.prototype.initButtonClickHandler = function () {
  this.$button.addEventListener('click', this.exitPage.bind(this))
}

/**
 * Create the HTML for the 'three lights' indicator on the button.
 */
ExitThisPage.prototype.buildIndicator = function () {
  // Build container
  // Putting `aria-hidden` on it as it won't contain any readable information
  this.$indicatorContainer = document.createElement('div')
  this.$indicatorContainer.className = 'govuk-exit-this-page__indicator'
  this.$indicatorContainer.setAttribute('aria-hidden', 'true')

  // Create three 'lights' and place them within the container
  for (var i = 0; i < 3; i++) {
    var $indicator = document.createElement('div')
    $indicator.className = 'govuk-exit-this-page__indicator-light'
    this.$indicatorContainer.appendChild($indicator)
  }

  // Append it all to the module
  this.$button.appendChild(this.$indicatorContainer)
}

/**
 * Update whether the lights are visible and which ones are lit up depending on
 * the value of `escCounter`.
 */
ExitThisPage.prototype.updateIndicator = function () {
  // Show or hide the indicator container depending on escCounter value
  if (this.escCounter > 0) {
    this.$indicatorContainer.classList.add('govuk-exit-this-page__indicator--visible')
  } else {
    this.$indicatorContainer.classList.remove('govuk-exit-this-page__indicator--visible')
  }

  // Show or hide the indicator container depending on escCounter value
  if (this.escCounter > 0) {
    this.$indicatorContainer.classList.add('govuk-hide-this-page__indicator--visible')
  } else {
    this.$indicatorContainer.classList.remove('govuk-hide-this-page__indicator--visible')
  }

  // Turn out all the lights
  var $lightsOn = this.$indicatorContainer.querySelectorAll('.govuk-exit-this-page__indicator-light--on')
  nodeListForEach($lightsOn, function ($light) {
    $light.classList.remove('govuk-exit-this-page__indicator-light--on')
  })

  // Turn on the ones we want on
  var $lightsQueried = this.$indicatorContainer.querySelectorAll('.govuk-exit-this-page__indicator-light')
  nodeListForEach($lightsQueried, function ($light, index) {
    if (index < this.escCounter) {
      $light.classList.add('govuk-exit-this-page__indicator-light--on')
    }
  }.bind(this))
}

/**
 * Initiates the redirection away from the current page.
 * Includes the 'ghost page' functionality, which covers the current page with a
 * white overlay so that the contents are not visible during the loading
 * process. This is particularly important on slow network connections.
 *
 * @param {MouseEvent} [e] - mouse click event
 */
ExitThisPage.prototype.exitPage = function (e) {
  if (typeof e !== 'undefined' && e.target) {
    e.preventDefault()
  }

  // Blank the page
  this.$overlay = document.createElement('div')
  this.$overlay.className = 'govuk-exit-this-page__overlay'
  document.body.appendChild(this.$overlay)

  window.location.href = this.$button.href
}

/**
 * Logic for the 'quick escape' keyboard sequence functionality (pressing the
 * Shift key three times without interruption, within a time limit).
 *
 * @param {KeyboardEvent} e - keyup event
 */
ExitThisPage.prototype.handleEscKeypress = function (e) {
  // Detect if the 'Shift' key has been pressed. We want to only do things if it
  // was pressed by itself and not in a combination with another key—so we keep
  // track of whether the preceding keyup had shiftKey: true on it, and if it
  // did, we ignore the next Shift keyup event.
  //
  // This works because using Shift as a modifier key (e.g. pressing Shift + A)
  // will fire TWO keyup events, one for A (with e.shiftKey: true) and the other
  // for Shift (with e.shiftKey: false).
  if (
    (e.key === 'Shift' || e.keyCode === 16 || e.which === 16) &&
    !this.lastKeyWasModified
  ) {
    this.escCounter += 1

    // Update the indicator before the below if statement can reset it back to 0
    this.updateIndicator()

    // Clear the timeout for the keypress timeout message clearing itself
    if (this.timeoutMessageId !== null) {
      clearTimeout(this.timeoutMessageId)
      this.timeoutMessageId = null
    }

    if (this.escCounter >= 3) {
      this.escCounter = 0
      clearTimeout(this.keypressTimeoutId)
      this.keypressTimeoutId = null

      this.$updateSpan.setAttribute('role', 'alert')
      this.$updateSpan.innerText = 'Exiting page'

      this.exitPage()
    } else {
      if (this.escCounter === 1) {
        this.$updateSpan.innerText = 'Shift, press 2 more times to exit.'
      } else {
        this.$updateSpan.innerText = 'Shift, press 1 more time to exit.'
      }
    }

    this.setEscTimer()
  } else if (this.keypressTimeoutId !== null) {
    // If the user pressed any key other than 'Shift', after having pressed
    // 'Shift' and activating the timer, stop and reset the timer.
    this.resetEscTimer()
  }

  // Keep track of whether the Shift modifier key was held during this keypress
  this.lastKeyWasModified = e.shiftKey
}

/**
 * Starts the 'quick escape' keyboard sequence timer.
 */
ExitThisPage.prototype.setEscTimer = function () {
  if (this.keypressTimeoutId === null) {
    this.keypressTimeoutId = setTimeout(function () {
      this.resetEscTimer()
    }.bind(this), this.timeoutTime)
  }
}

/**
 * Stops and resets the 'quick escape' keyboard sequence timer.
 */
ExitThisPage.prototype.resetEscTimer = function () {
  clearTimeout(this.keypressTimeoutId)
  this.keypressTimeoutId = null

  this.escCounter = 0
  this.$updateSpan.innerText = 'Exit this page expired'

  this.timeoutMessageId = setTimeout(function () {
    this.$updateSpan.innerText = ''
  }.bind(this), this.timeoutTime)

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
 */
ExitThisPage.prototype.resetPage = function () {
  // If an overlay is set, remove it and reset the value
  if (this.$overlay) {
    this.$overlay.remove()
    this.$overlay = null
  }

  // Ensure the announcement span's role is status, not alert and clear any text
  this.$updateSpan.setAttribute('role', 'status')
  this.$updateSpan.innerText = ''

  // Sync the keypress indicator lights
  this.updateIndicator()

  // If the timeouts are active, clear them
  if (this.keypressTimeoutId) {
    clearTimeout(this.keypressTimeoutId)
  }

  if (this.timeoutMessageId) {
    clearTimeout(this.timeoutMessageId)
  }
}

/**
 * Initialise component
 */
ExitThisPage.prototype.init = function () {
  this.buildIndicator()
  this.initUpdateSpan()
  this.initButtonClickHandler()

  // Check to see if this has already been done by a previous initialisation of ExitThisPage
  if (!('govukFrontendExitThisPageEsc' in document.body.dataset)) {
    document.addEventListener('keyup', this.handleEscKeypress.bind(this), true)
    document.body.dataset.govukFrontendExitThisPageEsc = true
  }

  // When the page is restored after navigating 'back' in some browsers the
  // blank overlay remains present, rendering the page unusable. Here, we check
  // to see if it's present on page (re)load, and remove it if so.
  if ('onpageshow' in window) {
    window.addEventListener('pageshow', this.resetPage.bind(this))
  } else {
    window.addEventListener('DOMContentLoaded', this.resetPage.bind(this))
  }
}

export default ExitThisPage
