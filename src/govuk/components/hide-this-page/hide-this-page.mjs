import { nodeListForEach } from '../../common.mjs'

function HideThisPage ($module) {
  this.$module = $module
  this.escCounter = 0
}

HideThisPage.prototype.exitPage = function (e) {
  // Doesn't do anything right now
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
    if (e.key === 'Escape' || e.keyCode === 27 || e.which === 27) {
      this.escCounter += 1

      if (this.escCounter >= 3) {
        document.querySelector('.govuk-js-hide-this-page-button').click()
      }

      setTimeout(function () {
        this.escCounter = 0
      }.bind(this), 2000)
    }
  }.bind(this))
}

export default HideThisPage
