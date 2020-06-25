import '../../vendor/polyfills/Function/prototype/bind'
// addEventListener, event.target normalization and DOMContentLoaded
import '../../vendor/polyfills/Event'
import '../../vendor/polyfills/Element/prototype/classList'
import { nodeListForEach } from '../../common'

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
  })

  // When the page is restored after navigating 'back' in some browsers the
  // state of form controls is not restored until *after* the DOMContentLoaded
  // event is fired, so we need to sync after the pageshow event in browsers
  // that support it.
  if ('onpageshow' in window) {
    window.addEventListener('pageshow', this.syncAll.bind(this))
  } else {
    window.addEventListener('DOMContentLoaded', this.syncAll.bind(this))
  }

  // Although we've set up handlers to sync state on the pageshow or
  // DOMContentLoaded event, init could be called after those events have fired,
  // for example if they are added to the page dynamically, so sync now too.
  this.syncAll()

  // Handle events
  $module.addEventListener('click', this.handleClick.bind(this))
}

Radios.prototype.syncAll = function () {
  nodeListForEach(this.$inputs, this.syncWithInputState.bind(this))
}

Radios.prototype.syncWithInputState = function ($input) {
  var $content = document.querySelector('#' + $input.getAttribute('aria-controls'))

  if ($content && $content.classList.contains('govuk-radios__conditional')) {
    var inputIsChecked = $input.checked

    $input.setAttribute('aria-expanded', inputIsChecked)

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
      this.syncWithInputState($input)
    }
  }.bind(this))
}

export default Radios
