
/*
  Accordion

  This allows a collection of sections to be collapsed by default,
  showing only their headers. Sections can be exanded or collapsed
  individually by clicking their headers. An "Open all" button is
  also added to the top of the accordion, which switches to "Close all"
  when all the sections are expanded.

  The state of each section is saved to the DOM via the `aria-expanded`
  attribute, which also provides accessibility.

*/

import { nodeListForEach } from '../../common'
import '../../vendor/polyfills/Function/prototype/bind'
import '../../vendor/polyfills/Element/prototype/classList'

var KEY_ENTER = 13
var KEY_SPACE = 32

function Accordion ($module) {
  this.$module = $module
  this.$sections = $module.querySelectorAll('.govuk-accordion__section')
  this.$openAllButton = ''
}

Accordion.prototype.init = function () {
  // Check for module
  var $module = this.$module
  if (!$module) {
    return
  }

  nodeListForEach(this.$sections, function ($section) {
    // Set header attributes
    var header = $section.querySelector('.govuk-accordion__section-header')
    this.setHeaderAttributes(header)

    var sectionExpanded = $section.classList.contains('govuk-accordion__section--expanded')
    $section.setAttribute('aria-expanded', sectionExpanded)

    /* Remove this class now, as the `aria-expanded` attribute is being used
     to store expanded state instead. */
    if (sectionExpanded) {
      this.$module.classList.remove('govuk-accordion__section--expanded')
    }
    // Handle events
    header.addEventListener('keypress', this.onKeyPressed.bind(this, $section))
    header.addEventListener('click', this.onToggleExpanded.bind(this, $section))
  }.bind(this))

  // Create "Open all" button and set attributes
  this.$openAllButton = document.createElement('button')
  this.setOpenAllButtonAttributes(this.$openAllButton)

  // Create controls and set attributes
  var accordionControls = document.createElement('div')
  accordionControls.setAttribute('class', 'govuk-accordion__controls')
  accordionControls.appendChild(this.$openAllButton)
  this.$module.insertBefore(accordionControls, this.$module.firstChild)

  this.$module.classList.add('with-js')

  // Handle events
  this.$openAllButton.addEventListener('click', this.openOrCloseAllSections.bind(this))
}

// Open/close section
Accordion.prototype.onToggleExpanded = function ($section) {
  var expanded = ($section.getAttribute('aria-expanded') === 'true')
  this.setExpanded(!expanded, $section)

  // See if OpenAll button text should be updated
  var areAllSectionsOpen = this.checkIfAllSectionsOpen()
  this.updateOpenAllButton(areAllSectionsOpen)
}

Accordion.prototype.onKeyPressed = function (section, event) {
  if (event.keyCode === KEY_ENTER || event.keyCode === KEY_SPACE) {
    event.preventDefault()

    // Open/close section
    this.onToggleExpanded(section)
  }
}

// Toggle aria-expanded when section opened/closed
Accordion.prototype.setExpanded = function (expanded, $section) {
  $section.setAttribute('aria-expanded', expanded)

  // This is set to trigger reflow for IE8, which doesn't
  // always reflow after a setAttribute call.
  this.$module.className = this.$module.className
}

Accordion.prototype.isExpanded = function ($section) {
  return ($section.getAttribute('aria-expanded') === 'true')
}

Accordion.prototype.setHeaderAttributes = function ($header) {
  $header.setAttribute('tabindex', '0')
  $header.setAttribute('role', 'button')

  var icon = document.createElement('span')
  icon.setAttribute('class', 'govuk-accordion--icon')

  $header.appendChild(icon)
}

Accordion.prototype.setOpenAllButtonAttributes = function ($button) {
  $button.textContent = 'Open all'
  $button.setAttribute('class', 'govuk-accordion__expand-all')
  $button.setAttribute('aria-expanded', 'false')
  $button.setAttribute('type', 'button')
}

// Open or close all sections
Accordion.prototype.openOrCloseAllSections = function () {
  var $module = this
  var $sections = this.$sections

  var nowExpanded = !($module.$openAllButton.getAttribute('aria-expanded') === 'true')

  nodeListForEach($sections, function ($section) {
    $module.setExpanded(nowExpanded, $section)
  })

  $module.updateOpenAllButton(nowExpanded)
}

// Update "Open all" button
Accordion.prototype.updateOpenAllButton = function (expanded) {
  var newButtonText = expanded ? 'Close all' : 'Open all'
  this.$openAllButton.setAttribute('aria-expanded', expanded)
  this.$openAllButton.textContent = newButtonText
}

// Check if all sections are open and update button text
Accordion.prototype.checkIfAllSectionsOpen = function () {
  var $this = this
  var $sections = this.$sections
  var sectionsCount = this.$sections.length
  var openSectionsCount = 0
  var areAllSectionsOpen = false

  nodeListForEach($sections, function ($section) {
    if ($this.isExpanded($section)) {
      openSectionsCount++
    }
  })

  areAllSectionsOpen = sectionsCount === openSectionsCount

  return areAllSectionsOpen
}

export default Accordion
