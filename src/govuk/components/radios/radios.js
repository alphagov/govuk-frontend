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

  nodeListForEach($inputs, function ($input) {
    var target = $input.getAttribute('data-aria-controls')

    // Skip radios without data-aria-controls attributes, or where the
    // target element does not exist.
    if (!target || !$module.querySelector('#' + target)) {
      return
    }

    // Promote the data-aria-controls attribute to a aria-controls attribute
    // so that the relationship is exposed in the AOM
    $input.setAttribute('aria-controls', target)
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
  var $target = document.querySelector('#' + $input.getAttribute('aria-controls'))

  if ($target && $target.classList.contains('govuk-radios__conditional')) {
    var inputIsChecked = $input.checked

    $input.setAttribute('aria-expanded', inputIsChecked)
    $target.classList.toggle('govuk-radios__conditional--hidden', !inputIsChecked)
  }
}

Radios.prototype.handleClick = function (event) {
  var $clickedInput = event.target

  // Ignore clicks on things that aren't radio buttons
  if ($clickedInput.type !== 'radio') {
    return
  }

  // Because checking one radio can un-check a radio in another $module, we need
  // to call set attributes on all radios in the same form that have the same
  // name.
  //
  // We only need to consider radios with conditional reveals, which will have
  // aria-controls attributes.
  var $allInputs = document.querySelectorAll('input[type="radio"][aria-controls]')

  nodeListForEach($allInputs, function ($input) {
    var hasSameFormOwner = ($input.form === $clickedInput.form)
    var hasSameName = ($input.name === $clickedInput.name)

    if (hasSameName && hasSameFormOwner) {
      this.syncWithInputState($input)
    }
  }.bind(this))
}

export default Radios
