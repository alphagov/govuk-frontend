// javascript 'shim' to trigger the click event of element(s)
// when the space key is pressed.
//
// Created since some Assistive Technologies (for example some Screenreaders)
// Will tell a user to press space on a 'button', so this functionality needs to be shimmed
// See https://github.com/alphagov/govuk_elements/pull/272#issuecomment-233028270
//
// Usage instructions:
// the 'shim' will be automatically initialised
;(function (global) {
  'use strict'

  var GOVUK_FRONTEND = global.GOVUK_FRONTEND || {}

  GOVUK_FRONTEND.shimLinksWithButtonRole = {

    eventHandler: function eventHandler (event) {
      // if the keyCode (which) is 32 it's a space, let's simulate a click.
      if (event.which === 32) {
        event.preventDefault()
        // trigger the target's click event
        event.target.click()
      }
    },

    init: function init () {
      let buttons = document.querySelectorAll('[role="button"]')

      buttons.forEach(function (element, index) {
        // listen to `[role="button"]` elements for `keydown` event
        element.addEventListener('keydown', GOVUK_FRONTEND.shimLinksWithButtonRole.eventHandler)
      })
    }

  }

  // hand back to global
  global.GOVUK_FRONTEND = GOVUK_FRONTEND

  // initialise
  GOVUK_FRONTEND.shimLinksWithButtonRole.init()
})(window)
