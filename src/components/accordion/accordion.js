
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

function Accordion ($module) {
  this.$module = $module
  this.$sections = $module.querySelectorAll('.govuk-accordion__section')
}

Accordion.prototype.init = function () {
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

  var accordionControls = document.createElement('div')
  accordionControls.setAttribute('class', 'govuk-accordion__controls')

  var openOrCloseAllButton = document.createElement('button')
  openOrCloseAllButton.textContent = 'Open all'
  openOrCloseAllButton.setAttribute('class', 'govuk-accordion__expand-all')
  openOrCloseAllButton.setAttribute('aria-expanded', 'false')
  openOrCloseAllButton.setAttribute('type', 'button')

  openOrCloseAllButton.addEventListener('click', this.openOrCloseAll.bind(this))

  accordionControls.appendChild(openOrCloseAllButton)

  this.$module.insertBefore(accordionControls, this.$module.firstChild)
  this.$module.classList.add('with-js')

}

Accordion.prototype.openOrCloseAll = function (event) {
  var openOrCloseAllButton = event.target
  var nowExpanded = !(openOrCloseAllButton.getAttribute('aria-expanded') === 'true')

  for (var i = this.sections.length - 1; i >= 0; i--) {
    this.sections[i].setExpanded(nowExpanded)
  };

  this.setOpenCloseButtonExpanded(nowExpanded)
}

Accordion.prototype.setOpenCloseButtonExpanded = function (expanded) {
  var openOrCloseAllButton = this.$module.querySelector('.govuk-accordion__expand-all')

  var newButtonText = expanded ? 'Close all' : 'Open all'
  openOrCloseAllButton.setAttribute('aria-expanded', expanded)
  openOrCloseAllButton.textContent = newButtonText
}

Accordion.prototype.updateOpenAll = function () {
  var $sections = this.$sections
  var sectionsCount = $sections.length

  var openSectionsCount = 0

  for (var i = $sections.length - 1; i >= 0; i--) {
    if (this.isExpanded($sections[i])) {
      openSectionsCount += 1
    }
  };

  if (sectionsCount === openSectionsCount) {
    this.setOpenCloseButtonExpanded(true)
  } else {
    this.setOpenCloseButtonExpanded(false)
  }
}

Accordion.prototype.onToggleExpanded = function ($section) {
  var expanded = ($section.getAttribute('aria-expanded') === 'true')

  this.setExpanded(!expanded, $section)
  this.updateOpenAll()
}

Accordion.prototype.onKeyPressed = function (section, event) {
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault()
    this.onToggleExpanded(section)
  }
}

Accordion.prototype.isExpanded = function ($section) {
  return ($section.getAttribute('aria-expanded') === 'true')
}

// Toggle aria-expanded when section opened/closed
Accordion.prototype.setExpanded = function (expanded, $section) {
  $section.setAttribute('aria-expanded', expanded)

  // This is set to trigger reflow for IE8, which doesn't
  // always reflow after a setAttribute call.
  this.$module.className = this.$module.className
}

Accordion.prototype.setHeaderAttributes = function ($header) {
  $header.setAttribute('tabindex', '0')
  $header.setAttribute('role', 'button')

  var icon = document.createElement('span')
  icon.setAttribute('class', 'govuk-accordion--icon')

  $header.appendChild(icon)
}

export default Accordion
