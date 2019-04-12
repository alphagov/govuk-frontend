import Popper from '../../../../node_modules/popper.js/dist/esm/popper'
import '../../../vendor/polyfills/Function/prototype/bind'
import '../../../vendor/polyfills/Event' // addEventListener and event.target normaliziation

function SdnHeader ($module) {
  this.$module = $module
  this.$toggleButton = null
  this.$dropdown = null
  this.popper = null
  this.blurEnabled = true
}

SdnHeader.prototype.init = function () {
  // Check for module
  var $module = this.$module
  if (!$module) {
    return
  }

  // Check for button
  this.$toggleButton = $module.querySelector('.js-dropdown-toggle')
  if (!this.$toggleButton) {
    return
  }

  $module.querySelectorAll('.sdn-header__dropdown a').forEach(function (node) {
    node.addEventListener('click', function () {
      this.$dropdown.style.display = 'none'
      this.blurEnabled = true
    }.bind(this))
  }.bind(this))

  this.$dropdown = $module.querySelector('#' + this.$toggleButton.getAttribute('aria-controls'))
  var $body = document.getElementsByTagName('body')[0]

  $body.appendChild(this.$dropdown)

  this.popper = new Popper(this.$toggleButton, this.$dropdown, {
    placement: 'bottom-end'
  })

  this.$toggleButton.addEventListener('click', this.handleClick.bind(this))
  this.$toggleButton.addEventListener('blur', this.handleBlur.bind(this))
  this.$dropdown.addEventListener('mouseenter', this.handleMouseenter.bind(this))
  this.$dropdown.addEventListener('mouseleave', this.handleMouseleave.bind(this))
}

/**
 * Toggle class
 * @param {object} node element
 * @param {string} className to toggle
 */
SdnHeader.prototype.toggleClass = function (node, className) {
  if (node.className.indexOf(className) > 0) {
    node.className = node.className.replace(' ' + className, '')
  } else {
    node.className += ' ' + className
  }
}

/**
 * An event handler for click event on $toggleButton
 * @param {object} event event
 */
SdnHeader.prototype.handleClick = function (event) {
  event.preventDefault()

  this.$dropdown.style.display = 'block'
  this.popper.update()
}
/**
 * An event handler for blur event on $toggleButton
 * @param {object} event event
 */
SdnHeader.prototype.handleBlur = function (event) {
  if (this.blurEnabled) {
    this.$dropdown.style.display = 'none'
  }
}

SdnHeader.prototype.handleMouseenter = function (event) {
  this.blurEnabled = false
}

SdnHeader.prototype.handleMouseleave = function (event) {
  this.blurEnabled = true
}

export default SdnHeader
