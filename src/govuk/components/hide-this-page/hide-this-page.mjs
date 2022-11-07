import { nodeListForEach } from '../../common.mjs'

function HideThisPage ($module) {
  this.$module = $module
  this.$button = $module.querySelector('.govuk-hide-this-page__button')
  this.$updateSpan = null
  this.$indicatorContainer = null
  this.escCounter = 0
  this.escTimerActive = false
}

HideThisPage.prototype.initUpdateSpan = function () {
  this.$updateSpan = document.createElement('span')
  this.$updateSpan.setAttribute('aria-live', 'polite')
  this.$updateSpan.setAttribute('class', 'govuk-visually-hidden')

  this.$module.appendChild(this.$updateSpan)
}

HideThisPage.prototype.initButtonClickHandler = function () {
  this.$button.addEventListener('click', this.exitPage.bind(this))
}

HideThisPage.prototype.buildIndicator = function () {
  // Build container
  // Putting `aria-hidden` on it as it won't contain any readable information
  this.$indicatorContainer = document.createElement('div')
  this.$indicatorContainer.className = 'govuk-hide-this-page__indicator'
  this.$indicatorContainer.setAttribute('data-status', '0')
  this.$indicatorContainer.setAttribute('aria-hidden', 'true')

  // Create three 'lights' and place them within the container
  for (var i = 0; i < 3; i++) {
    var $indicator = document.createElement('div')
    $indicator.className = 'govuk-hide-this-page__indicator-light'
    this.$indicatorContainer.appendChild($indicator)
  }

  // Append it all to the module
  this.$module.appendChild(this.$indicatorContainer)
}

HideThisPage.prototype.updateIndicator = function () {
  console.log(this.escCounter)

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
  var $lightsQueried = this.$indicatorContainer.querySelectorAll('.govuk-hide-this-page__indicator-light:nth-child(-n+' + this.escCounter + ')')
  nodeListForEach($lightsQueried, function ($light) {
    $light.classList.add('govuk-hide-this-page__indicator-light--on')
  })
}

HideThisPage.prototype.exitPage = function (e) {
  // we don't do anything with this just yet
}

HideThisPage.prototype.handleEscKeypress = function (e) {
  if (e.key === 'Esc' || e.keyCode === 27 || e.which === 27) {
    this.escCounter += 1

    // Update the indicator before the below if statement can reset it back to 0
    this.updateIndicator()

    if (this.escCounter >= 3) {
      this.escCounter = 0
      this.$updateSpan.innerText = 'Exit this page activated'
      window.location.href = this.$button.href
    } else {
      this.$updateSpan.innerText = 'Exit this Page key press ' + this.escCounter + ' of 3'
    }

    this.setEscTimer()
  }
}

HideThisPage.prototype.setEscTimer = function () {
  if (!this.escTimerActive) {
    this.escTimerActive = true

    setTimeout(function () {
      this.escCounter = 0
      this.escTimerActive = false
      this.$updateSpan.innerText = ''
      this.updateIndicator()
    }.bind(this), 2000)
  }
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
}

export default HideThisPage
