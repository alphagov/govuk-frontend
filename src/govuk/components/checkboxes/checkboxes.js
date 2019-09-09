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

  // Inject aria-live region to use for announcements
  var $announcer = document.createElement('div')
  $announcer.className = 'govuk-visually-hidden js-govuk-checkboxes__announcer'
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
  var announcedText = ''
  nodeListForEach($inputs, function ($input) {
    var controls = $input.getAttribute('data-aria-controls')

    // Check if input controls anything
    // Check if content exists, before setting attributes.
    if (!controls || !$module.querySelector('#' + controls)) {
      return
    }

    announcedText += $input.labels[0].innerText + ', ' + ($input.checked ? 'Expanded' : 'Collapsed') + '. '

    this.setAttributes($input)
  }.bind(this))

  this.$announcer.innerText = announcedText

  // Handle events
  $module.addEventListener('click', this.handleClick.bind(this))
}

Checkboxes.prototype.setAttributes = function ($input) {
  var inputIsChecked = $input.checked

  var $content = this.$module.querySelector('#' + $input.getAttribute('data-aria-controls'))
  if ($content) {
    $content.classList.toggle('govuk-checkboxes__conditional--hidden', !inputIsChecked)
  }
}

Checkboxes.prototype.handleClick = function (event) {
  var $module = this.$module
  var $inputs = this.$inputs
  var $target = event.target

  // If a checkbox with aria-controls, handle click
  var isCheckbox = $target.getAttribute('type') === 'checkbox'
  var hasAriaControls = $target.getAttribute('data-aria-controls')
  if (isCheckbox && hasAriaControls) {

    var announcedText = ''
    nodeListForEach($inputs, function ($input) {
      var controls = $input.getAttribute('data-aria-controls')

      // Check if input controls anything
      // Check if content exists, before setting attributes.
      if (!controls || !$module.querySelector('#' + controls)) {
        return
      }

      announcedText += $input.labels[0].innerText + ', ' + ($input.checked ? 'Expanded' : 'Collapsed') + '.'
    })

    this.$announcer.innerText = announcedText

    this.setAttributes($target)
  }
}

export default Checkboxes
