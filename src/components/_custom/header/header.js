import Popper from '../../../../node_modules/popper.js/dist/esm/popper'
import '../../../vendor/polyfills/Function/prototype/bind'
import '../../../vendor/polyfills/Event' // addEventListener and event.target normaliziation

function SdnHeader ($module) {
  this.$module = $module
  this.$toggleButton = null
  this.$dropdown = null
  this.popper = null
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

  this.$dropdown = $module.querySelector('#' + this.$toggleButton.getAttribute('aria-controls'))
  var $body = document.getElementsByTagName('body')[0]

  $body.appendChild(this.$dropdown)

  this.popper = new Popper(this.$toggleButton, this.$dropdown, {
    placement: 'bottom-end'
  })

  // Handle $toggleButton click events
  this.$toggleButton.addEventListener('click', this.handleClick.bind(this))
  this.$toggleButton.addEventListener('blur', this.handleBlur.bind(this))
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

  this.popper.update()

  this.$dropdown.style.display = 'block'

  // var popperInstance = new Popper(this.$toggleButton, $target, {
  //   placement: 'left'
  // })
  //
  // console.log($target)

  // // If a button with aria-controls, handle click
  // if ($toggleButton && $target) {
  //   this.toggleClass($target, 'govuk-header__navigation--open')
  //   this.toggleClass($toggleButton, 'govuk-header__menu-button--open')
  //
  //   $toggleButton.setAttribute('aria-expanded', $toggleButton.getAttribute('aria-expanded') !== 'true')
  //   $target.setAttribute('aria-hidden', $target.getAttribute('aria-hidden') === 'false')
  // }
}
/**
 * An event handler for blur event on $toggleButton
 * @param {object} event event
 */
SdnHeader.prototype.handleBlur = function (event) {
  this.$dropdown.style.display = 'none'
}

export default SdnHeader
