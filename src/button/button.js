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
import { addEvent, charCode, preventDefault } from '../globals/common'

var KEY_SPACE = 32

function Button () { }

/**
* Add event handler for KeyDown
* if the event target element has a role='button' and the event is key space pressed
* then it prevents the default event and triggers a click event
* @param {object} event event
*/
Button.prototype.handleKeyDown = function (event) {
  // get the target element
  var target = event.target || event.srcElement
  // if the element has a role='button' and the pressed key is a space, we'll simulate a click
  if (target.getAttribute('role') === 'button' && charCode(event) === KEY_SPACE) {
    preventDefault(event)
    // trigger the target's click event
    target.click()
  }
}

/**
* Initialise an event listener for keydown at document level
* this will help listening for later inserted elements with a role="button"
*/
Button.prototype.init = function () {
  addEvent(document, 'keydown', this.handleKeyDown)
}

export default Button
