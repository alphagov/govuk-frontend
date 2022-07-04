import '../../vendor/polyfills/Event.mjs' // addEventListener and event.target normaliziation
import '../../vendor/polyfills/Function/prototype/bind.mjs'

var KEY_SPACE = 32
var DEBOUNCE_TIMEOUT_IN_SECONDS = 1

function Button ($module) {
  this.$module = $module
  this.debounceFormSubmitTimer = null
}

/**
* JavaScript 'shim' to trigger the click event of element(s) when the space key is pressed.
*
* Created since some Assistive Technologies (for example some Screenreaders)
* will tell a user to press space on a 'button', so this functionality needs to be shimmed
* See https://github.com/alphagov/govuk_elements/pull/272#issuecomment-233028270
*
* @param {object} event event
*/
Button.prototype.handleKeyDown = function (event) {
  // get the target element
  var target = event.target
  // if the element has a role='button' and the pressed key is a space, we'll simulate a click
  if (target.getAttribute('role') === 'button' && event.keyCode === KEY_SPACE) {
    event.preventDefault()
    // trigger the target's click event
    target.click()
  }
}

/**
* If the click quickly succeeds a previous click then nothing will happen.
* This stops people accidentally causing multiple form submissions by
* double clicking buttons.
*/
Button.prototype.debounce = function (event) {
  var target = event.target
  // Check the button that is clicked on has the preventDoubleClick feature enabled
  if (target.getAttribute('data-prevent-double-click') !== 'true') {
    return
  }

  // If the timer is still running then we want to prevent the click from submitting the form
  if (this.debounceFormSubmitTimer) {
    event.preventDefault()
    return false
  }

  this.debounceFormSubmitTimer = setTimeout(function () {
    this.debounceFormSubmitTimer = null
  }.bind(this), DEBOUNCE_TIMEOUT_IN_SECONDS * 1000)
}

/**
* Initialise an event listener for keydown at document level
* this will help listening for later inserted elements with a role="button"
*/
Button.prototype.init = function () {
  this.$module.addEventListener('keydown', this.handleKeyDown)
  this.$module.addEventListener('click', this.debounce)
}

export default Button
