import '../../../vendor/polyfills/Function/prototype/bind'
import '../../../vendor/polyfills/Event'
import { on } from '../../../common'

function SdnTimeline ($module) {
  this.$module = $module
}

SdnTimeline.prototype.init = function () {
  // Check for module
  var $module = this.$module
  if (!$module || $module.className.indexOf('snd-timeline--readonly') > -1) {
    return
  }

  on('body', 'click', '.js-sdn-timeline__bullet', this.handleClick.bind(this))
}

SdnTimeline.prototype.handleClick = function (event) {
  event.preventDefault()

  var element = event.target

  element.parentNode.classList.toggle('sdn-timeline__step--dropdown-active')

  if (!element.getAttribute('data-blur-initialized')) {
    element.setAttribute('data-blur-initialized', true)
    element.setAttribute('tabindex', '0')
    element.addEventListener('focusout', this.handleBlur)
    element.focus()
  }
}

SdnTimeline.prototype.handleBlur = function (event) {
  event.preventDefault()

  setTimeout(function () {
    this.parentNode.classList.remove('sdn-timeline__step--dropdown-active')
  }.bind(this), 100)
}

export default SdnTimeline
