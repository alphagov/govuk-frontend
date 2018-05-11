import '../../globals/polyfills/Function/prototype/bind'
import '../../globals/polyfills/Event' // addEventListener and event.target normaliziation
import { nodeListForEach } from '../../globals/common'

function Radios ($module) {
  this.$module = $module
  this.$inputs = $module.querySelectorAll('input[type="radio"]')
}

Radios.prototype.init = function () {
  var $module = this.$module
  var $inputs = this.$inputs

  /**
  * Loop over all items with [data-controls]
  * Check if they have a matching conditional reveal
  * If they do, assign attributes.
  **/
  nodeListForEach($inputs, function ($input) {
    var controls = $input.getAttribute('data-aria-controls')

    // Check if input controls anything
    // Check if content exists, before setting attributes.
    if (!controls || !$module.querySelector('#' + controls)) {
      return
    }

    // If we have content that is controlled, set attributes.
    $input.setAttribute('aria-controls', controls)
    $input.removeAttribute('data-aria-controls')
    this.setAttributes($input)
  }.bind(this))

  // Handle events
  $module.addEventListener('click', this.handleClick.bind(this))
}

Radios.prototype.setAttributes = function ($input) {
  var inputIsChecked = $input.checked
  $input.setAttribute('aria-expanded', inputIsChecked)

  var $content = document.querySelector('#' + $input.getAttribute('aria-controls'))
  $content.setAttribute('aria-hidden', !inputIsChecked)
}

Radios.prototype.handleClick = function (event) {
  nodeListForEach(this.$inputs, function ($input) {
    // If a radio with aria-controls, handle click
    var isRadio = $input.getAttribute('type') === 'radio'
    var hasAriaControls = $input.getAttribute('aria-controls')
    if (isRadio && hasAriaControls) {
      this.setAttributes($input)
    }
  }.bind(this))
}

export default Radios
