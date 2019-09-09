import '../../vendor/polyfills/Function/prototype/bind'
import '../../vendor/polyfills/Event' // addEventListener and event.target normaliziation
import '../../vendor/polyfills/Element/prototype/classList'
import { nodeListForEach } from '../../common'

function Checkboxes ($module) {
  this.$module = $module
  this.$inputs = $module.querySelectorAll('input[type="checkbox"]')
}

Checkboxes.prototype.init = function () {
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

    this.setAttributes($input)
  }.bind(this))

  // Handle events
  $module.addEventListener('click', this.handleClick.bind(this))
}

Checkboxes.prototype.setAttributes = function ($input) {
  var inputIsChecked = $input.checked
  var $label = document.querySelector('.govuk-checkboxes__label[for=' + $input.id + ']')
  // If the label does not have hidden text for state, inject it.
  if (!$label.querySelector('.js-govuk-checkboxes__label__state')) {
    $label.innerHTML = $label.innerHTML + '<span class="govuk-visually-hidden js-govuk-checkboxes__label__state"></span>'
  }
  // Set the hidden text for state depending on if it's expanded or not.
  $label.querySelector('.js-govuk-checkboxes__label__state').innerText = inputIsChecked ? 'Expanded' : 'Collapsed'

  var $content = this.$module.querySelector('#' + $input.getAttribute('data-aria-controls'))
  if ($content) {
    $content.classList.toggle('govuk-checkboxes__conditional--hidden', !inputIsChecked)
  }
}

Checkboxes.prototype.handleClick = function (event) {
  var $target = event.target

  // If a checkbox with aria-controls, handle click
  var isCheckbox = $target.getAttribute('type') === 'checkbox'
  var hasAriaControls = $target.getAttribute('data-aria-controls')
  if (isCheckbox && hasAriaControls) {
    this.setAttributes($target)
  }
}

export default Checkboxes
