/**
 * JavaScript 'polyfill' for HTML5's <details> and <summary> elements
 * and 'shim' to add accessiblity enhancements for all browsers
 *
 * http://caniuse.com/#feat=details
 */
import '../../vendor/polyfills/Function/prototype/bind.mjs'
import '../../vendor/polyfills/Event.mjs' // addEventListener and event.target normaliziation
import { generateUniqueID } from '../../common.mjs'

var KEY_ENTER = 13
var KEY_SPACE = 32

function Details ($module) {
  this.$module = $module
}

Details.prototype.init = function () {
  if (!this.$module) {
    return
  }

  // If there is native details support, we want to avoid running code to polyfill native behaviour.
  var hasNativeDetails = typeof this.$module.open === 'boolean'

  if (hasNativeDetails) {
    return
  }

  this.polyfillDetails()
}

Details.prototype.polyfillDetails = function () {
  var $module = this.$module

  // Save shortcuts to the inner summary and content elements
  var $summary = this.$summary = $module.getElementsByTagName('summary').item(0)
  var $content = this.$content = $module.getElementsByTagName('div').item(0)

  // If <details> doesn't have a <summary> and a <div> representing the content
  // it means the required HTML structure is not met so the script will stop
  if (!$summary || !$content) {
    return
  }

  // If the content doesn't have an ID, assign it one now
  // which we'll need for the summary's aria-controls assignment
  if (!$content.id) {
    $content.id = 'details-content-' + generateUniqueID()
  }

  // Add ARIA role="group" to details
  $module.setAttribute('role', 'group')

  // Add role=button to summary
  $summary.setAttribute('role', 'button')

  // Add aria-controls
  $summary.setAttribute('aria-controls', $content.id)

  // Set tabIndex so the summary is keyboard accessible for non-native elements
  //
  // We have to use the camelcase `tabIndex` property as there is a bug in IE6/IE7 when we set the correct attribute lowercase:
  // See http://web.archive.org/web/20170120194036/http://www.saliences.com/browserBugs/tabIndex.html for more information.
  $summary.tabIndex = 0

  // Detect initial open state
  if (this.$module.hasAttribute('open')) {
    $summary.setAttribute('aria-expanded', 'true')
  } else {
    $summary.setAttribute('aria-expanded', 'false')
    $content.style.display = 'none'
  }

  // Bind an event to handle summary elements
  this.polyfillHandleInputs($summary, this.polyfillSetAttributes.bind(this))
}

/**
* Define a statechange function that updates aria-expanded and style.display
* @param {object} summary element
*/
Details.prototype.polyfillSetAttributes = function () {
  if (this.$module.hasAttribute('open')) {
    this.$module.removeAttribute('open')
    this.$summary.setAttribute('aria-expanded', 'false')
    this.$content.style.display = 'none'
  } else {
    this.$module.setAttribute('open', 'open')
    this.$summary.setAttribute('aria-expanded', 'true')
    this.$content.style.display = ''
  }

  return true
}

/**
* Handle cross-modal click events
* @param {object} node element
* @param {function} callback function
*/
Details.prototype.polyfillHandleInputs = function (node, callback) {
  node.addEventListener('keypress', function (event) {
    var target = event.target
    // When the key gets pressed - check if it is enter or space
    if (event.keyCode === KEY_ENTER || event.keyCode === KEY_SPACE) {
      if (target.nodeName.toLowerCase() === 'summary') {
        // Prevent space from scrolling the page
        // and enter from submitting a form
        event.preventDefault()
        // Click to let the click event do all the necessary action
        if (target.click) {
          target.click()
        } else {
          // except Safari 5.1 and under don't support .click() here
          callback(event)
        }
      }
    }
  })

  // Prevent keyup to prevent clicking twice in Firefox when using space key
  node.addEventListener('keyup', function (event) {
    var target = event.target
    if (event.keyCode === KEY_SPACE) {
      if (target.nodeName.toLowerCase() === 'summary') {
        event.preventDefault()
      }
    }
  })

  node.addEventListener('click', callback)
}

export default Details
