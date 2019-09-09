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

    this.setAttributes($input)
  }.bind(this))

  // Handle events
  $module.addEventListener('click', this.handleClick.bind(this))
}

Radios.prototype.setAttributes = function ($input) {
  var $content = document.querySelector('#' + $input.getAttribute('data-aria-controls'))

  if ($content && $content.classList.contains('govuk-radios__conditional')) {
    var inputIsChecked = $input.checked
    var $label = document.querySelector('.govuk-radios__label[for=' + $input.id + ']')
    // If the label does not have hidden text for state, inject it.
    if (!$label.querySelector('.js-govuk-radios__label__state')) {
      $label.innerHTML = $label.innerHTML + '<span class="govuk-visually-hidden js-govuk-radios__label__state"></span>'
    }
    // Set the hidden text for state depending on if it's expanded or not.
    $label.querySelector('.js-govuk-radios__label__state').innerText = inputIsChecked ? 'Expanded' : 'Collapsed'

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
  // We also only want radios which have data-aria-controls, as they support conditional reveals.
  var $allInputs = document.querySelectorAll('input[type="radio"][data-aria-controls]')
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
