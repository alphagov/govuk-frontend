// javascript 'shim' to trigger the click event of element(s)
// when the space key is pressed.
//
// Created since some Assistive Technologies (for example some Screenreaders)
// Will tell a user to press space on a 'button', so this functionality needs to be shimmed
// See https://github.com/alphagov/govuk_elements/pull/272#issuecomment-233028270
//
// Usage instructions:
// GOVUK.shimLinksWithButtonRole.init();
;(function (global) {
  'use strict'

  var $ = global.jQuery
  var GOVUK = global.GOVUK || {}

  GOVUK.shimLinksWithButtonRole = {

    init: function init () {
      // listen to 'document' for keydown event on the any elements that should be buttons.
      $(document).on('keydown', '[role="button"]', function (event) {
        // if the keyCode (which) is 32 it's a space, let's simulate a click.
        if (event.which === 32) {
          event.preventDefault()
          // trigger the target's click event
          event.target.click()
        }
      })
    }

  }

  // hand back to global
  global.GOVUK = GOVUK
})(window)
