import { nodeListForEach } from '../../common.mjs'

function HideThisPage ($module) {
  this.$module = $module
  this.firstButton = this.$module[0].querySelector('.govuk-js-hide-this-page-button')
  this.updateSpan = null
  this.escCounter = 0
  this.escTimerActive = false
}

HideThisPage.prototype.initUpdateSpan = function () {
  this.updateSpan = document.createElement('span')
  this.updateSpan.setAttribute('aria-live', 'polite')
  this.updateSpan.setAttribute('class', 'govuk-visually-hidden')

  this.$module[0].appendChild(this.updateSpan)
}

HideThisPage.prototype.initButtonClickHandler = function () {
  // We put the loop here instead of in all.js because we want to have both
  // listeners on the individual buttons for clicks and a single listener for
  // the keyboard shortcut
  nodeListForEach(this.$module, function ($button) {
    $button.querySelector('.govuk-js-hide-this-page-button').addEventListener('click', this.exitPage.bind(this))
  }.bind(this))
}

HideThisPage.prototype.exitPage = function (e) {
  // we don't do anything with this just yet
}

HideThisPage.prototype.handleEscKeypress = function (e) {
  if (e.key === 'Esc' || e.keyCode === 27 || e.which === 27) {
    this.escCounter += 1

    if (this.escCounter >= 3) {
      this.escCounter = 0
      this.updateSpan.innerText = 'Exit this page activated'
      window.location.href = this.firstButton.href
    } else {
      this.updateSpan.innerText = 'Exit this Page key press ' + this.escCounter + ' of 3'
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
      this.updateSpan.innerText = ''
    }.bind(this), 2000)
  }
}

HideThisPage.prototype.init = function () {
  this.initUpdateSpan()
  this.initButtonClickHandler()
  document.addEventListener('keyup', this.handleEscKeypress.bind(this), true)
}

export default HideThisPage
