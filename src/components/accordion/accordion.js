
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
  this.moduleId = $module.getAttribute('id')
  this.$sections = $module.querySelectorAll('.govuk-accordion__section')
  this.$openAllButton = ''
  this.browserSupportsSessionStorage = helper.checkForSessionStorage()
}

// Initialize component
Accordion.prototype.init = function () {
  // Check for module
  if (!this.$module) {
    return
  }

  this.createControls()

  this.initSectionHeaders()

  // See if OpenAll button text should be updated
  var areAllSectionsOpen = this.checkIfAllSectionsOpen()
  this.updateOpenAllButton(areAllSectionsOpen)
}

// Create controls and set attributes
Accordion.prototype.createControls = function () {
  // Create "Open all" button and set attributes
  this.$openAllButton = document.createElement('button')
  this.$openAllButton.setAttribute('type', 'button')
  this.setOpenAllButtonAttributes(this.$openAllButton)

  // Create control wrapper and add controls to it
  var accordionControls = document.createElement('div')
  accordionControls.setAttribute('class', 'govuk-accordion__controls')
  accordionControls.appendChild(this.$openAllButton)
  this.$module.insertBefore(accordionControls, this.$module.firstChild)

  // Handle events for the controls
  this.$openAllButton.addEventListener('click', this.openOrCloseAllSections.bind(this))
}

// Initialise section headers
Accordion.prototype.initSectionHeaders = function () {
  // Loop through section headers
  nodeListForEach(this.$sections, function ($section, i) {
    // Set header attributes
    var header = $section.querySelector('.govuk-accordion__section-header')
    this.setHeaderAttributes(header, i)

    this.setExpanded(this.isExpanded($section), $section)

    // Handle events
    header.addEventListener('click', this.onToggleExpanded.bind(this, $section))

    // See if there is any state stored in sessionStorage and set the sections to
    // open or closed.
    this.setInitialState($section)
  }.bind(this))
}

// Open/close section
Accordion.prototype.onToggleExpanded = function ($section) {
  var expanded = this.isExpanded($section)
  this.setExpanded(!expanded, $section)

  // Store the state in sessionStorage when a change is triggered
  this.storeState($section)

  // See if OpenAll button text should be updated
  var areAllSectionsOpen = this.checkIfAllSectionsOpen()
  this.updateOpenAllButton(areAllSectionsOpen)
}

// Toggle attributes when section opened/closed
Accordion.prototype.setExpanded = function (expanded, $section) {
  var $button = $section.querySelector('.govuk-accordion__section-button')
  $button.setAttribute('aria-expanded', expanded)

  if (expanded) {
    $section.classList.add('govuk-accordion__section--expanded')
  } else {
    $section.classList.remove('govuk-accordion__section--expanded')
  }

  // This is set to trigger reflow for IE8, which doesn't
  // always reflow after a setAttribute call.
  this.$module.className = this.$module.className
}

Accordion.prototype.isExpanded = function ($section) {
  return $section.classList.contains('govuk-accordion__section--expanded')
}

Accordion.prototype.setHeaderAttributes = function ($headerWrapper, index) {
  var $span = $headerWrapper.querySelector('.govuk-accordion__section-button')
  var $heading = $headerWrapper.querySelector('.govuk-accordion__section-heading')
  var $summary = $headerWrapper.querySelector('.govuk-accordion__section-summary')
  var focusedClass = 'govuk-accordion__section-header--focused'

  // Copy existing span element to an actual button element, for improved accessibility.
  var $button = document.createElement('button')
  $button.setAttribute('class', $span.getAttribute('class'))
  $button.setAttribute('type', 'button')
  $button.setAttribute('id', this.moduleId + '-heading-' + (index + 1))
  $button.setAttribute('aria-controls', this.moduleId + '-content-' + (index + 1))

  $button.addEventListener('focusin', function (e) {
    if (!$headerWrapper.classList.contains(focusedClass)) {
      $headerWrapper.className += ' ' + focusedClass
    }
  })

  $button.addEventListener('blur', function (e) {
    $headerWrapper.classList.remove(focusedClass)
  })

  if (typeof ($summary) !== 'undefined' && $summary !== null) {
    $button.setAttribute('aria-describedby', this.moduleId + '-summary-' + (index + 1))
  }

  // $span could contain HTML elements (see https://www.w3.org/TR/2011/WD-html5-20110525/content-models.html#phrasing-content)
  $button.innerHTML = $span.innerHTML

  $heading.removeChild($span)
  $heading.appendChild($button)

  // Add "+/-" icon
  var icon = document.createElement('span')

  icon.className = 'govuk-accordion__icon'
  icon.setAttribute('aria-hidden', 'true')

  $heading.appendChild(icon)
}

Accordion.prototype.setOpenAllButtonAttributes = function ($button) {
  $button.innerHTML = 'Open all <span class="govuk-visually-hidden">sections</span>'
  $button.setAttribute('class', 'govuk-accordion__open-all')
  $button.setAttribute('aria-expanded', 'false')
  $button.setAttribute('type', 'button')
}

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
  newButtonText += '<span class="govuk-visually-hidden"> sections</span>'
  this.$openAllButton.setAttribute('aria-expanded', expanded)
  this.$openAllButton.innerHTML = newButtonText
}

// Check if all sections are open and update button text
Accordion.prototype.checkIfAllSectionsOpen = function () {
  // Get a count of all the Accordion sections
  var sectionsCount = this.$sections.length
  // Get a count of all Accordion sections that are expanded
  var expandedSectionCount = this.$module.querySelectorAll('.govuk-accordion__section--expanded').length
  var areAllSectionsOpen = sectionsCount === expandedSectionCount

  return areAllSectionsOpen
}

// Check for `window.sessionStorage`, and that it actually works.
var helper = {
  checkForSessionStorage: function () {
    var testString = 'this is the test string'
    var result
    try {
      window.sessionStorage.setItem(testString, testString)
      result = window.sessionStorage.getItem(testString) === testString.toString()
      window.sessionStorage.removeItem(testString)
      return result
    } catch (exception) {
      if ((typeof console === 'undefined' || typeof console.log === 'undefined')) {
        console.log('Notice: sessionStorage not available.')
      }
    }
  }
}

// Set the state of the accordions in sessionStorage
Accordion.prototype.storeState = function ($section) {
  if (this.browserSupportsSessionStorage) {
    // We need a unique way of identifying each content in the accordion. Since
    // an `#id` should be unique and an `id` is required for `aria-` attributes
    // `id` can be safely used.
    var $button = $section.querySelector('.govuk-accordion__section-button')

    if ($button) {
      var contentId = $button.getAttribute('aria-controls')
      var contentState = $button.getAttribute('aria-expanded')

      if (typeof contentId === 'undefined' && (typeof console === 'undefined' || typeof console.log === 'undefined')) {
        console.error(new Error('No aria controls present in accordion section heading.'))
      }

      if (typeof contentState === 'undefined' && (typeof console === 'undefined' || typeof console.log === 'undefined')) {
        console.error(new Error('No aria expanded present in accordion section heading.'))
      }

      // Only set the state when both `contentId` and `contentState` are taken from the DOM.
      if (contentId && contentState) {
        window.sessionStorage.setItem(contentId, contentState)
      }
    }
  }
}

// Read the state of the accordions from sessionStorage
Accordion.prototype.setInitialState = function ($section) {
  if (this.browserSupportsSessionStorage) {
    var $button = $section.querySelector('.govuk-accordion__section-button')

    if ($button) {
      var contentId = $button.getAttribute('aria-controls')
      var contentState = contentId ? window.sessionStorage.getItem(contentId) : null

      if (contentState !== null) {
        this.setExpanded(contentState === 'true', $section)
      }
    }
  }
}

export default Accordion
