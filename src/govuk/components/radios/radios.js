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

  // Inject aria-live region to use for announcements
  var $announcer = document.createElement('div')
  $announcer.className = 'govuk-visually-hidden js-govuk-radios__announcer'
  // Stolen from accessible autocomplete...
  $announcer.setAttribute('aria-atomic', 'true')
  $announcer.setAttribute('aria-live', 'polite')
  $announcer.setAttribute('role', 'status')
  this.$announcer = $announcer
  this.$module.appendChild($announcer)

  /**
  * Loop over all items with [data-controls]
  * Check if they have a matching conditional reveal
  * If they do, assign attributes.
  **/
  var $checkedInput = null
  nodeListForEach($inputs, function ($input) {
    var controls = $input.getAttribute('data-aria-controls')

    // Check if input controls anything
    // Check if content exists, before setting attributes.
    if (!controls || !$module.querySelector('#' + controls)) {
      return
    }

    if ($input.checked) {
      $checkedInput = $input
    }

    this.setAttributes($input)
  }.bind(this))

  if ($checkedInput) {
    this.$announcer.innerText = $checkedInput.labels[0].innerText + ', Expanded'
  }

  // Handle events
  $module.addEventListener('click', this.handleClick.bind(this))
}

Radios.prototype.setAttributes = function ($input) {
  var $content = document.querySelector('#' + $input.getAttribute('data-aria-controls'))

  if ($content && $content.classList.contains('govuk-radios__conditional')) {
    var inputIsChecked = $input.checked

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

  var $checkedInput = null
  nodeListForEach($allInputs, function ($input) {
    // Only inputs with the same form owner should change.
    var hasSameFormOwner = ($input.form === $clickedInput.form)

    // In radios, only radios with the same name will affect each other.
    var hasSameName = ($input.name === $clickedInput.name)
    if (hasSameName && hasSameFormOwner) {
      this.setAttributes($input)
    }

    if ($input.checked) {
      $checkedInput = $input
    }
  }.bind(this))
  this.$announcer.innerText = $checkedInput.labels[0].innerText + ', Expanded'
}

export default Radios
