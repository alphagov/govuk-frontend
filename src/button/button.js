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

  GOVUK_FRONTEND.buttons = {
    /**
    * Add event construct for modern browsers or IE
    * which fires the callback with a pre-converted target reference
    * @param {object} node element
    * @param {string} type event type (e.g. click, load, or error)
    * @returns {function} callback function
    */
    addEvent: function (node, type, callback) {
      if (node.addEventListener) {
        node.addEventListener(type, function (e) {
          callback(e, e.target)
        }, false)
      } else if (node.attachEvent) {
        node.attachEvent('on' + type, function (e) {
          callback(e, e.srcElement)
        })
      }
    },

    // Cross-browser character code / key pressed
    charCode: function (e) {
      return (typeof e.which === 'number') ? e.which : e.keyCode
    },

    // Cross-browser preventing default action
    preventDefault: function (e) {
      if (e.preventDefault) {
        e.preventDefault()
      } else {
        e.returnValue = false
      }
    },

    eventHandler: function (event) {
      // if the keyCode (which) is 32 it's a space, let's simulate a click.
      if (GOVUK_FRONTEND.buttons.charCode(event) === 32) {
        GOVUK_FRONTEND.buttons.preventDefault(event)
        // trigger the target's click event
        event.target.click()
      }
    },

    init: function () {
      var buttons = document.querySelectorAll('[role="button"]')

      // listen to `[role="button"]` elements for `keydown` event
      for (var i = 0; i < buttons.length; i++) {
        GOVUK_FRONTEND.buttons.addEvent(buttons[i], 'keydown', GOVUK_FRONTEND.buttons.eventHandler)
      }
    }

  }

  // hand back to global
  global.GOVUK_FRONTEND = GOVUK_FRONTEND

  // auto-initialise
  GOVUK_FRONTEND.buttons.init()
})(window)
