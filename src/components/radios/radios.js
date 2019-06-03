import '../../vendor/polyfills/Function/prototype/bind'
import '../../vendor/polyfills/Event' // addEventListener and event.target normaliziation
import '../../vendor/polyfills/Element/prototype/classList'
import '../../vendor/polyfills/Element/prototype/closest'
import { nodeListForEach } from '../../common'

function Radios ($module) {
  this.$module = $module

  // Find optional parent group
  var $wrapper = $module.closest('.govuk-form-group')
  var $parentWrapper = $wrapper && $wrapper.parentNode.closest('.govuk-form-group')

  // Add radios in optional wrappers up to one level higher
  this.$formGroup = $parentWrapper || $wrapper || $module
  this.$inputs = this.$formGroup.querySelectorAll('input[type="radio"]')
}

Radios.prototype.init = function () {
  var $formGroup = this.$formGroup
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
    if (!controls || !$formGroup.querySelector('#' + controls)) {
      return
    }

    // If we have content that is controlled, set attributes.
    $input.setAttribute('aria-controls', controls)
    $input.removeAttribute('data-aria-controls')
    this.setAttributes($input)
  }.bind(this))

  // Handle events
  $formGroup.addEventListener('click', this.handleClick.bind(this))
}

Radios.prototype.setAttributes = function ($input) {
  var inputIsChecked = $input.checked
  $input.setAttribute('aria-expanded', inputIsChecked)

  var $content = this.$formGroup.querySelector('#' + $input.getAttribute('aria-controls'))
  if ($content) {
    $content.classList.toggle('govuk-radios__conditional--hidden', !inputIsChecked)
  }
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
