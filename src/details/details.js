/**
 * JavaScript 'polyfill' for HTML5's <details> and <summary> elements
 * and 'shim' to add accessiblity enhancements for all browsers
 *
 * http://caniuse.com/#feat=details
 *
 * Usage instructions:
 * the 'polyfill' will be automatically initialised
 */

;(function (global) {
  'use strict'

  var GOVUK_FRONTEND = global.GOVUK_FRONTEND || {}
  var KEY_ENTER = 13
  var KEY_SPACE = 32

  GOVUK_FRONTEND.details = {

    // Create a flag to know if the browser supports navtive details
    NATIVE_DETAILS: typeof document.createElement('details').open === 'boolean',

    // Create a flag so we can prevent the initialisation
    // function firing from both DOMContentLoaded and window.onload
    INITIALISED: false,

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
    * Remove event utility for modern browsers or IE8
    * @param {object} node element
    * @param {string} type event type (e.g. click, load, or error)
    * @param {function} callback function
    */
    removeEvent: function (node, type, callback) {
      // Support: IE9+ and other browsers
      if (node.removeEventListener) {
        node.removeEventListener(type, function (e) {
          callback(e, e.target)
        }, false)
      // Support: IE8
      } else if (node.detachEvent) {
        node.detachEvent('on' + type, function (e) {
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
    * Handle cross-modal click events
    * @param {object} node element
    * @param {function} callback function
    */
    eventHandler: function (node, callback) {
      GOVUK_FRONTEND.details.addEvent(node, 'keypress', function (e, target) {
        // When the key gets pressed - check if it is enter or space
        if (GOVUK_FRONTEND.details.charCode(e) === KEY_ENTER || GOVUK_FRONTEND.details.charCode(e) === KEY_SPACE) {
          if (target.nodeName.toLowerCase() === 'summary') {
            // Prevent space from scrolling the page
            // and enter from submitting a form
            GOVUK_FRONTEND.details.preventDefault(e)
            // Click to let the click event do all the necessary action
            if (target.click) {
              target.click()
            } else {
              // except Safari 5.1 and under don't support .click() here
              callback(e, target)
            }
          }
        }
      })

      // Prevent keyup to prevent clicking twice in Firefox when using space key
      GOVUK_FRONTEND.details.addEvent(node, 'keyup', function (e, target) {
        if (GOVUK_FRONTEND.details.charCode(e) === KEY_SPACE) {
          if (target.nodeName.toLowerCase() === 'summary') {
            GOVUK_FRONTEND.details.preventDefault(e)
          }
        }
      })

      GOVUK_FRONTEND.details.addEvent(node, 'click', function (e, target) {
        callback(e, target)
      })
    },

    /**
    * Get the nearest ancestor element of a node that matches a given tag name
    * @param {object} node element
    * @param {string} match tag name (e.g. div)
    */
    getAncestor: function (node, match) {
      do {
        if (!node || node.nodeName.toLowerCase() === match) {
          break
        }
        node = node.parentNode
      } while (node)

      return node
    },

    /**
    * Initialise the script on a list of details elements in a container
    * @param {object} list of details elements
    * @param {string} container where to look for details elements
    */
    initDetails: function (list, container) {
      container = container || document.body
      // If this has already happened, just return
      // else set the flag so it doesn't happen again
      if (GOVUK_FRONTEND.details.INITIALISED) {
        return
      }
      GOVUK_FRONTEND.details.INITIALISED = true
      // Get the collection of details elements, but if that's empty
      // then we don't need to bother with the rest of the scripting
      if ((list = container.getElementsByTagName('details')).length === 0) {
        return
      }
      // else iterate through them to apply their initial state
      var n = list.length
      var i = 0
      for (i; i < n; i++) {
        var details = list[i]

        // Save shortcuts to the inner summary and content elements
        details.__summary = details.getElementsByTagName('summary').item(0)
        details.__content = details.getElementsByTagName('div').item(0)

        // If <details> doesn't have a <summary> and a <div> representing the content
        // it means the required HTML structure is not met so the script will stop
        if (!details.__summary || !details.__content) {
          return
        }

        // If the content doesn't have an ID, assign it one now
        // which we'll need for the summary's aria-controls assignment
        if (!details.__content.id) {
          details.__content.id = 'details-content-' + i
        }

        // Add ARIA role="group" to details
        details.setAttribute('role', 'group')

        // Add role=button to summary
        details.__summary.setAttribute('role', 'button')

        // Add aria-controls
        details.__summary.setAttribute('aria-controls', details.__content.id)

        // Set tabIndex so the summary is keyboard accessible for non-native elements
        // http://www.saliences.com/browserBugs/tabIndex.html
        if (!GOVUK_FRONTEND.details.NATIVE_DETAILS) {
          details.__summary.tabIndex = 0
        }

        // Detect initial open state
        var openAttr = details.getAttribute('open') !== null
        if (openAttr === true) {
          details.__summary.setAttribute('aria-expanded', 'true')
          details.__content.setAttribute('aria-hidden', 'false')
        } else {
          details.__summary.setAttribute('aria-expanded', 'false')
          details.__content.setAttribute('aria-hidden', 'true')
          if (!GOVUK_FRONTEND.details.NATIVE_DETAILS) {
            details.__content.style.display = 'none'
          }
        }

        // Create a circular reference from the summary back to its
        // parent details element, for convenience in the click handler
        details.__summary.__details = details
      }

      // Bind an event to handle summary elements
      GOVUK_FRONTEND.details.eventHandler(container, function (e, summary) {
        if (!(summary = GOVUK_FRONTEND.details.getAncestor(summary, 'summary'))) {
          return true
        }
        return GOVUK_FRONTEND.details.statechange(summary)
      })
    },

    /**
    * Define a statechange function that updates aria-expanded and style.display
    * @param {object} summary element
    */
    statechange: function (summary) {
      var expanded = summary.__details.__summary.getAttribute('aria-expanded') === 'true'
      var hidden = summary.__details.__content.getAttribute('aria-hidden') === 'true'

      summary.__details.__summary.setAttribute('aria-expanded', (expanded ? 'false' : 'true'))
      summary.__details.__content.setAttribute('aria-hidden', (hidden ? 'false' : 'true'))

      if (!GOVUK_FRONTEND.details.NATIVE_DETAILS) {
        summary.__details.__content.style.display = (expanded ? 'none' : '')

        var hasOpenAttr = summary.__details.getAttribute('open') !== null
        if (!hasOpenAttr) {
          summary.__details.setAttribute('open', 'open')
        } else {
          summary.__details.removeAttribute('open')
        }
      }
      return true
    },

    /**
    * Remove the click event from the node element
    * @param {object} node element
    */
    destroy: function (node) {
      GOVUK_FRONTEND.details.removeEvent(node, 'click')
    },

    /**
    * Initialise an event listener for DOMContentLoaded at document level
    * and load at window level
    *
    * If the first one fires it will set a flag to block the second one
    * but if it's not supported then the second one will fire
    */
    init: function () {
      GOVUK_FRONTEND.details.addEvent(document, 'DOMContentLoaded', GOVUK_FRONTEND.details.initDetails)
      GOVUK_FRONTEND.details.addEvent(window, 'load', GOVUK_FRONTEND.details.initDetails)
    }
  }
  // hand back to global
  global.GOVUK_FRONTEND = GOVUK_FRONTEND

  // auto-initialise
  GOVUK_FRONTEND.details.init()
})(window)
