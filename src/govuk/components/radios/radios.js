import '../../vendor/polyfills/Function/prototype/bind'
import '../../vendor/polyfills/Event' // addEventListener and event.target normaliziation
import '../../vendor/polyfills/Element/prototype/classList'
import { nodeListForEach } from '../../common'

function Radios ($module) {
  this.$module = $module
}

Radios.prototype.init = function () {
  var $module = this.$module
  var $inputs = $module.querySelectorAll('input[type="radio"]')

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
  if ($content) {
    $content.classList.toggle('govuk-radios__conditional--hidden', !inputIsChecked)
  }
}

Radios.prototype.handleClick = function (event) {
  var $clickedInput = event.target
  // We only want to handle clicks for radio inputs
  if ($clickedInput.type !== 'radio') {
    return
  }
  // Because checking one radio can uncheck a radio in another $module,
  // we need to call set attributes on all radios in the same form, or document if they're not in a form.
  //
  // We also only want radios which have aria-controls, as they support conditional reveals.
  var $allInputs = document.querySelectorAll('input[type="radio"][aria-controls]')
  nodeListForEach($allInputs, function ($input) {
    // Only inputs with the same form owner should change.
    var hasSameFormOwner = ($input.form === $clickedInput.form)

    // In radios, only radios with the same name will affect each other.
    var hasSameName = ($input.name === $clickedInput.name)
    if (hasSameName && hasSameFormOwner) {
      this.setAttributes($input)
    }
  }.bind(this))
}

export default Radios
