import { nodeListForEach } from '../../common.mjs'
import '../../vendor/polyfills/Element/prototype/classList.mjs'
import '../../vendor/polyfills/Element/prototype/dataset.mjs'

function HideThisPage ($module) {
  this.$module = $module
  this.$button = $module.querySelector('.govuk-hide-this-page__button')
  this.$updateSpan = null
  this.$indicatorContainer = null
  this.$overlay = null
  this.escCounter = 0
  this.escTimerActive = false
  this.timeout = 5000 // milliseconds
}

HideThisPage.prototype.initUpdateSpan = function () {
  this.$updateSpan = document.createElement('span')
  this.$updateSpan.setAttribute('aria-live', 'polite')
  this.$updateSpan.setAttribute('class', 'govuk-visually-hidden')

  this.$button.appendChild(this.$updateSpan)
}

HideThisPage.prototype.initButtonClickHandler = function () {
  this.$button.addEventListener('click', this.exitPage.bind(this))
}

HideThisPage.prototype.buildIndicator = function () {
  // Build container
  // Putting `aria-hidden` on it as it won't contain any readable information
  this.$indicatorContainer = document.createElement('div')
  this.$indicatorContainer.className = 'govuk-hide-this-page__indicator'
  this.$indicatorContainer.setAttribute('aria-hidden', 'true')

  // Create three 'lights' and place them within the container
  for (var i = 0; i < 3; i++) {
    var $indicator = document.createElement('div')
    $indicator.className = 'govuk-hide-this-page__indicator-light'
    this.$indicatorContainer.appendChild($indicator)
  }

  // Append it all to the module
  this.$button.appendChild(this.$indicatorContainer)
}

HideThisPage.prototype.updateIndicator = function () {
  // Show or hide the indicator container depending on escCounter value
  if (this.escCounter > 0) {
    this.$indicatorContainer.classList.add('govuk-hide-this-page__indicator--visible')
  } else {
    this.$indicatorContainer.classList.remove('govuk-hide-this-page__indicator--visible')
  }

  // Turn out all the lights
  var $lightsOn = this.$indicatorContainer.querySelectorAll('.govuk-hide-this-page__indicator-light--on')
  nodeListForEach($lightsOn, function ($light) {
    $light.classList.remove('govuk-hide-this-page__indicator-light--on')
  })

  // Turn on the ones we want on
  var $lightsQueried = this.$indicatorContainer.querySelectorAll('.govuk-hide-this-page__indicator-light')
  nodeListForEach($lightsQueried, function ($light, index) {
    if (index < this.escCounter) {
      $light.classList.add('govuk-hide-this-page__indicator-light--on')
    }
  }.bind(this))
}

HideThisPage.prototype.exitPage = function (e) {
  if (typeof e !== 'undefined' && e.target) {
    e.preventDefault()
  }

  // Blank the page
  this.$overlay = document.createElement('div')
  this.$overlay.className = 'govuk-hide-this-page__overlay'
  document.body.appendChild(this.$overlay)

  window.location.href = this.$button.href
}

HideThisPage.prototype.handleEscKeypress = function (e) {
  // Detect if the 'Shift' key has been pressed. This only detects if pressed by
  // itself and not in a combination with another key (otherwise that key would
  // be e.key, and e.shiftKey would be true instead.)
  //
  // Little bit janky as when using Shift as a combinator (e.g. Shift + A) it
  // will fire TWO events, one for A (with e.shiftKey) and the other for Shift
  // (without e.shiftKey).
  if (e.key === 'Shift' || e.keyCode === 16 || e.which === 16) {
    this.escCounter += 1

    // Update the indicator before the below if statement can reset it back to 0
    this.updateIndicator()

    if (this.escCounter >= 3) {
      this.escCounter = 0
      this.$updateSpan.innerText = 'Exit this page activated'
      this.exitPage()
    } else {
      this.$updateSpan.innerText = 'Exit this Page key press ' + this.escCounter + ' of 3'
    }

    this.setEscTimer()
  } else if (this.escTimerActive) {
    // If the user pressed any key other than 'Shift', after having pressed
    // 'Shift' and activating the timer, stop and reset the timer.
    this.resetEscTimer()
  }
}

HideThisPage.prototype.setEscTimer = function () {
  if (!this.escTimerActive) {
    this.escTimerActive = true

    setTimeout(function () {
      this.resetEscTimer()
    }.bind(this), this.timeout)
  }
}

HideThisPage.prototype.resetEscTimer = function () {
  this.escCounter = 0
  this.escTimerActive = false
  this.$updateSpan.innerText = ''
  this.updateIndicator()
}

HideThisPage.prototype.syncOverlayVisibility = function () {
  // If there is no overlay, don't do anything
  if (!this.$overlay) { return }

  // If there is, remove the element and references to it
  this.$overlay.remove()
  this.$overlay = null
}

HideThisPage.prototype.init = function () {
  this.buildIndicator()
  this.initUpdateSpan()
  this.initButtonClickHandler()

  // Check to see if this has already been done by a previous initialisation of HideThisPage
  if (!('govukFrontendHideThisPageEsc' in document.body.dataset)) {
    document.addEventListener('keyup', this.handleEscKeypress.bind(this), true)
    document.body.dataset.govukFrontendHideThisPageEsc = true
  }

  // When the page is restored after navigating 'back' in some browsers the
  // blank overlay remains present, rendering the page unusable. Here, we check
  // to see if it's present on page (re)load, and remove it if so.
  if ('onpageshow' in window) {
    window.addEventListener('pageshow', this.syncOverlayVisibility.bind(this))
  } else {
    window.addEventListener('DOMContentLoaded', this.syncOverlayVisibility.bind(this))
  }
}

export default HideThisPage
