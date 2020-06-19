import '../../vendor/polyfills/Function/prototype/bind'
// addEventListener, event.target normalization and DOMContentLoaded
import '../../vendor/polyfills/Event'
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

    // If we have content that is controlled, set attributes.
    $input.setAttribute('aria-controls', controls)
    $input.removeAttribute('data-aria-controls')
  })

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', this.syncState.bind(this))
  } else {
    this.syncState()
  }

  // When the page is restored after navigating 'back' in some browsers the
  // state of form controls is not restored until *after* the DOMContentLoaded
  // event is fired, so we need to sync after the pageshow event is fired as
  // well.
  //
  // (Older browsers don't have a pageshow event, so we do both.)
  window.addEventListener('pageshow', this.syncState.bind(this))

  // Handle events
  $module.addEventListener('click', this.handleClick.bind(this))
}

Checkboxes.prototype.syncState = function () {
  nodeListForEach(this.$inputs, function ($input) {
    this.setAttributes($input)
  }.bind(this))
}

Checkboxes.prototype.setAttributes = function ($input) {
  var inputIsChecked = $input.checked
  $input.setAttribute('aria-expanded', inputIsChecked)

  var $content = this.$module.querySelector('#' + $input.getAttribute('aria-controls'))
  if ($content) {
    $content.classList.toggle('govuk-checkboxes__conditional--hidden', !inputIsChecked)
  }
}

Checkboxes.prototype.handleClick = function (event) {
  var $target = event.target

  // If a checkbox with aria-controls, handle click
  var isCheckbox = $target.getAttribute('type') === 'checkbox'
  var hasAriaControls = $target.getAttribute('aria-controls')
  if (isCheckbox && hasAriaControls) {
    this.setAttributes($target)
  }
}

export default Checkboxes
