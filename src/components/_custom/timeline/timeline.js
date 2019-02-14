import '../../../vendor/polyfills/Function/prototype/bind'
import '../../../vendor/polyfills/Event'
import { nodeListForEach } from '../../../common'

function SdnTimeline ($module) {
  this.$module = $module
  this.$bullets = []
}

SdnTimeline.prototype.init = function () {
  // Check for module
  var $module = this.$module
  if (!$module) {
    return
  }

  this.$bullets = $module.querySelectorAll('.js-sdn-timeline__bullet')

  nodeListForEach(this.$bullets, function ($bullet) {
    $bullet.setAttribute('tabindex', '0')
    $bullet.addEventListener('click', this.handleClick)
    $bullet.addEventListener('focusout', this.handleBlur)
  }.bind(this))
}

SdnTimeline.prototype.handleClick = function (event) {
  event.preventDefault()

  this.parentNode.classList.toggle('sdn-timeline__step--dropdown-active')
}

SdnTimeline.prototype.handleBlur = function (event) {
  event.preventDefault()

  setTimeout(function () {
    this.parentNode.classList.remove('sdn-timeline__step--dropdown-active')
  }.bind(this), 100)
}

export default SdnTimeline
