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
;(function (global) {
  'use strict'

  var GOVUK_FRONTEND = global.GOVUK_FRONTEND || {}
  var KEY_SPACE = 32

  GOVUK_FRONTEND.buttons = {

    /**
    * Add event construct for modern browsers or IE8
    * which fires the callback with a pre-converted target reference
    * @param {object} node element
    * @param {string} type event type (e.g. click, load, or error)
    * @param {function} callback function
    */
    addEvent: function (node, type, callback) {
      // Support: IE9+ and other browsers
      if (node.addEventListener) {
        node.addEventListener(type, function (e) {
          callback(e, e.target)
        }, false)
      // Support: IE8
      } else if (node.attachEvent) {
        node.attachEvent('on' + type, function (e) {
          callback(e, e.srcElement)
        })
      }
    },

    /**
    * Cross-browser character code / key pressed
    * @param {object} e event
    * @returns {number} character code
    */
    charCode: function (e) {
      return (typeof e.which === 'number') ? e.which : e.keyCode
    },

    /**
    * Cross-browser preventing default action
    * @param {object} e event
    */
    preventDefault: function (e) {
      // Support: IE9+ and other browsers
      if (e.preventDefault) {
        e.preventDefault()
      // Support: IE8
      } else {
        e.returnValue = false
      }
    },

    /**
    * Add event handler
    * if the event target element has a role='button' and the event is key space pressed
    * then it prevents the default event and triggers a click event
    * @param {object} e event
    */
    eventHandler: function (e) {
      // get the target element
      var target = e.target || e.srcElement
      // if the element has a role='button' and the pressed key is a space, we'll simulate a click
      if (target.getAttribute('role') === 'button' && GOVUK_FRONTEND.buttons.charCode(e) === KEY_SPACE) {
        GOVUK_FRONTEND.buttons.preventDefault(e)
        // trigger the target's click event
        target.click()
      }
    },

    /**
    * Initialise an event listener for keydown at document level
    * this will help listening for later inserted elements with a role="button"
    */
    init: function () {
      GOVUK_FRONTEND.buttons.addEvent(document, 'keydown', GOVUK_FRONTEND.buttons.eventHandler)
    }

  }

  // hand back to global
  global.GOVUK_FRONTEND = GOVUK_FRONTEND

  // auto-initialise
  GOVUK_FRONTEND.buttons.init()
})(window)
