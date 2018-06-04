/**
 * JavaScript 'polyfill' for HTML5's <details> and <summary> elements
 * and 'shim' to add accessiblity enhancements for all browsers
 *
 * http://caniuse.com/#feat=details
 *
 * Usage instructions:
 * the 'polyfill' will be automatically initialised
 */
import '../../vendor/polyfills/Function/prototype/bind'
import '../../vendor/polyfills/Event' // addEventListener and event.target normaliziation
import { generateUniqueID } from '../../common.js'

var KEY_ENTER = 13
var KEY_SPACE = 32

// Create a flag to know if the browser supports navtive details
var NATIVE_DETAILS = typeof document.createElement('details').open === 'boolean'

function Details ($module) {
  this.$module = $module
}

/**
* Handle cross-modal click events
* @param {object} node element
* @param {function} callback function
*/
Details.prototype.handleKeyDown = function (node, callback) {
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
          callback(event, target)
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

  node.addEventListener('click', function (event) {
    var target = event.target
    callback(event, target)
  })
}

/**
* Get the nearest ancestor element of a node that matches a given tag name
* @param {object} node element
* @param {string} match tag name (e.g. div)
*/
Details.prototype.getAncestor = function (node, match) {
  do {
    if (!node || node.nodeName.toLowerCase() === match) {
      break
    }
    node = node.parentNode
  } while (node)

  return node
}

Details.prototype.init = function () {
  var $module = this.$module

  if (!$module) {
    return
  }

  var details = $module

  // Save shortcuts to the inner summary and content elements
  $module.__summary = $module.getElementsByTagName('summary').item(0)
  $module.__content = $module.getElementsByTagName('div').item(0)

  // If <details> doesn't have a <summary> and a <div> representing the content
  // it means the required HTML structure is not met so the script will stop
  if (!$module.__summary || !$module.__content) {
    return
  }

  // If the content doesn't have an ID, assign it one now
  // which we'll need for the summary's aria-controls assignment
  if (!$module.__content.id) {
    $module.__content.id = 'details-content-' + generateUniqueID()
  }

  // Add ARIA role="group" to details
  $module.setAttribute('role', 'group')

  // Add role=button to summary
  $module.__summary.setAttribute('role', 'button')

  // Add aria-controls
  $module.__summary.setAttribute('aria-controls', $module.__content.id)

  // Set tabIndex so the summary is keyboard accessible for non-native elements
  // http://www.saliences.com/browserBugs/tabIndex.html
  if (!NATIVE_DETAILS) {
    $module.__summary.tabIndex = 0
  }

  // Detect initial open state
  var openAttr = $module.getAttribute('open') !== null
  if (openAttr === true) {
    $module.__summary.setAttribute('aria-expanded', 'true')
    $module.__content.setAttribute('aria-hidden', 'false')
  } else {
    $module.__summary.setAttribute('aria-expanded', 'false')
    $module.__content.setAttribute('aria-hidden', 'true')
    if (!NATIVE_DETAILS) {
      $module.__content.style.display = 'none'
    }
  }

  // Create a circular reference from the summary back to its
  // parent details element, for convenience in the click handler
  $module.__summary.__details = details

  // Bind an event to handle summary elements
  this.handleKeyDown($module, function (event, summary) {
    if (!(summary = this.getAncestor(summary, 'summary'))) {
      return true
    }
    return this.stateChange(summary)
  }.bind(this))
}

/**
* Define a statechange function that updates aria-expanded and style.display
* @param {object} summary element
*/
Details.prototype.stateChange = function (summary) {
  var expanded = summary.__details.__summary.getAttribute('aria-expanded') === 'true'
  var hidden = summary.__details.__content.getAttribute('aria-hidden') === 'true'

  summary.__details.__summary.setAttribute('aria-expanded', (expanded ? 'false' : 'true'))
  summary.__details.__content.setAttribute('aria-hidden', (hidden ? 'false' : 'true'))

  if (!NATIVE_DETAILS) {
    summary.__details.__content.style.display = (expanded ? 'none' : '')

    var hasOpenAttr = summary.__details.getAttribute('open') !== null
    if (!hasOpenAttr) {
      summary.__details.setAttribute('open', 'open')
    } else {
      summary.__details.removeAttribute('open')
    }
  }
  return true
}

/**
* Remove the click event from the node element
* @param {object} node element
*/
Details.prototype.destroy = function (node) {
  node.removeEventListener('keypress')
  node.removeEventListener('keyup')
  node.removeEventListener('click')
}

export default Details
