import '../../../vendor/polyfills/Function/prototype/bind'
import '../../../vendor/polyfills/Event'
import { nodeListForEach, on } from '../../../common'

function SdnTimeline ($module) {
  this.$module = $module
}

SdnTimeline.prototype.init = function () {
  // Check for module
  var $module = this.$module
  if (!$module || $module.className.indexOf('snd-timeline--readonly') > -1) {
    return
  }

  document.addEventListener('click', this.handleBlur.bind(this))
  on('body', 'click', '.js-sdn-timeline__bullet', this.handleClick.bind(this))
  on('body', 'click', '.sdn-timeline-dropdown__option', this.closeMenu)
}

SdnTimeline.prototype.handleClick = function (event) {
  event.preventDefault()

  var element = event.target

  this.closeMenu()
  element.parentNode.classList.add('sdn-timeline__step--dropdown-active')

  if (!element.getAttribute('data-blur-initialized')) {
    element.setAttribute('data-blur-initialized', true)
    element.setAttribute('tabindex', '0')
    // element.addEventListener('focusout', this.handleBlur)
    element.focus()
  }
}

SdnTimeline.prototype.handleBlur = function (event) {
  var closeMenu = true
  closeMenu = closeMenu && !event.target.classList.contains('sdn-timeline-dropdown__option')
  closeMenu = closeMenu && !event.target.classList.contains('sdn-timeline-dropdown__bullet')
  closeMenu = closeMenu && !event.target.classList.contains('sdn-timeline-dropdown__additional-info')

  if (event.target.classList.contains('js-sdn-timeline__bullet')) {
    closeMenu = !event.target.parentNode.classList.contains('sdn-timeline__step--dropdown-active')
  }

  if (closeMenu) {
    this.closeMenu()
  }
}

SdnTimeline.prototype.closeMenu = function () {
  var items = document.querySelectorAll('.sdn-timeline__step--dropdown-active')
  nodeListForEach(items, function (item) {
    item.classList.remove('sdn-timeline__step--dropdown-active')
  })
}

export default SdnTimeline
