import { nodeListForEach } from '../../common.mjs'

function HideThisPage ($module) {
  this.$module = $module
  this.escCounter = 0
  this.escTimerActive = false
}

HideThisPage.prototype.exitPage = function (e) {
  // Doesn't do anything right now
}

HideThisPage.prototype.setEscTimer = function () {
  if (!this.escTimerActive) {
    this.escTimerActive = true

    setTimeout(function () {
      this.escCounter = 0
      this.escTimerActive = false
    }.bind(this), 2000)
  }
}

HideThisPage.prototype.init = function () {
  // We put the loop here instead of in all.js because we want to have both
  // listeners on the individual buttons for clicks and a single listener for
  // the keyboard shortcut
  nodeListForEach(this.$module, function ($button) {
    // We won't set an event listener on the link just yet, we'll treat it just like a link first
    // $button.querySelector('.govuk-js-hide-this-page-button').addEventListener('click', this.exitPage)
  }) // must remember to bind once we've got an event handler ready

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Alt' || e.keyCode === 18 || e.which === 18) {
      this.escCounter += 1

      if (this.escCounter >= 3) {
        this.escCounter = 0
        document.querySelector('.govuk-js-hide-this-page-button').click()
      }

      this.setEscTimer()
    }
  }.bind(this))
}

export default HideThisPage
