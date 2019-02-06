/**
 * JavaScript 'shim' to trigger the click event of element(s) when the space key is pressed.
 *
 * Created since some Assistive Technologies (for example some Screenreaders)
 * will tell a user to press space on a 'button', so this functionality needs to be shimmed
 * See https://github.com/alphagov/govuk_elements/pull/272#issuecomment-233028270
 *
 * Usage instructions:
 * the 'shim' will be automatically initialised
 */
import '../../vendor/polyfills/Function/prototype/bind'
import '../../vendor/polyfills/Event' // addEventListener and event.target normaliziation

var KEY_SPACE = 32
var DEBOUNCE_TIMEOUT_IN_SECONDS = 1

function Button ($module) {
  this.$module = $module

  this.options = {}
  this.options.debounce = ($module.attributes && $module.getAttribute('data-debounce') === 'true')

  if (this.options.debounce) {
    this.debounceFormSubmitTimer = null
  }
}

/**
* if the event target element has a role='button' and the event is key space pressed
* then it prevents the default event and triggers a click event
* @param {object} event event
*/
Button.prototype.handleKeyDown = function (event) {
  // if the element has a role='button' and the pressed key is a space, we'll simulate a click
  if (event.keyCode === KEY_SPACE) {
    event.preventDefault()
    // trigger the target's click event
    event.target.click()
  }
}

/**
* If the click quickly succeeds a previous click then nothing will happen.
* This stops people accidentally causing multiple form submissions by
* double clicking buttons.
*/
Button.prototype.debounce = function (event) {
  // Only handle events on <input> and <button> elements
  var tagName = event.target.tagName
  if (tagName !== 'INPUT' && tagName !== 'BUTTON') {
    return
  }

  var $button = event.target

  // We only want to to handle submit buttons that are used in forms
  var isSubmitButton = $button.type === 'submit'
  var isInsideAForm = $button.form

  if (!isSubmitButton || !isInsideAForm) {
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
  var $module = this.$module

  // If the module is a link that is meant to be a button handle keydown.
  if ($module.attributes && $module.getAttribute('role') === 'button') {
    $module.addEventListener('keydown', this.handleKeyDown.bind(this))
  }

  if (this.options.debounce === true) {
    $module.addEventListener('click', this.debounce.bind(this))
  }
}

export default Button
