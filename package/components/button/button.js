(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('all', factory) :
	(global.all = factory());
}(this, (function () { 'use strict';

/**
* Add event construct for modern browsers or IE8
* which fires the callback with a pre-converted target reference
* @param {object} node element
* @param {string} type event type (e.g. click, load, or error)
* @param {function} callback function
*/
function addEvent (node, type, callback) {
  // Support: IE9+ and other browsers
  if (node.addEventListener) {
    node.addEventListener(type, function (event) {
      callback(event, event.target);
    }, false);
  // Support: IE8
  } else if (node.attachEvent) {
    node.attachEvent('on' + type, function (event) {
      callback(event, event.srcElement);
    });
  }
}

/**
* Cross-browser character code / key pressed
* @param {object} event event
* @returns {number} character code
*/
function charCode (event) {
  return (typeof event.which === 'number') ? event.which : event.keyCode
}

/**
* Cross-browser preventing default action
* @param {object} event event
*/
function preventDefault (event) {
  // Support: IE9+ and other browsers
  if (event.preventDefault) {
    event.preventDefault();
  // Support: IE8
  } else {
    event.returnValue = false;
  }
}

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

var KEY_SPACE = 32;

function Button () { }

/**
* Add event handler for KeyDown
* if the event target element has a role='button' and the event is key space pressed
* then it prevents the default event and triggers a click event
* @param {object} event event
*/
Button.prototype.handleKeyDown = function (event) {
  // get the target element
  var target = event.target || event.srcElement;
  // if the element has a role='button' and the pressed key is a space, we'll simulate a click
  if (target.getAttribute('role') === 'button' && charCode(event) === KEY_SPACE) {
    preventDefault(event);
    // trigger the target's click event
    target.click();
  }
};

/**
* Initialise an event listener for keydown at document level
* this will help listening for later inserted elements with a role="button"
*/
Button.prototype.init = function () {
  addEvent(document, 'keydown', this.handleKeyDown);
};

return Button;

})));
