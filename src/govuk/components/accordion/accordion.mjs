import { nodeListForEach, mergeConfigs, extractConfigByNamespace } from '../../common/index.mjs'
import { I18n } from '../../i18n.mjs'
import '../../vendor/polyfills/Function/prototype/bind.mjs'
import '../../vendor/polyfills/Element/prototype/classList.mjs'
import '../../vendor/polyfills/String/prototype/trim.mjs'
import { normaliseDataset } from '../../common/normalise-dataset.mjs'

/**
 * @constant
 * @type {AccordionTranslations}
 * @see Default value for {@link AccordionConfig.i18n}
 * @default
 */
var ACCORDION_TRANSLATIONS = {
  hideAllSections: 'Hide all sections',
  hideSection: 'Hide',
  hideSectionAriaLabel: 'Hide this section',
  showAllSections: 'Show all sections',
  showSection: 'Show',
  showSectionAriaLabel: 'Show this section'
}

/**
 * Accordion component
 *
 * This allows a collection of sections to be collapsed by default, showing only
 * their headers. Sections can be expanded or collapsed individually by clicking
 * their headers. A "Show all sections" button is also added to the top of the
 * accordion, which switches to "Hide all sections" when all the sections are
 * expanded.
 *
 * The state of each section is saved to the DOM via the `aria-expanded`
 * attribute, which also provides accessibility.
 *
 * @class
 * @param {HTMLElement} $module - HTML element to use for accordion
 * @param {AccordionConfig} [config] - Accordion config
 */
function Accordion ($module, config) {
  this.$module = $module
  this.$sections = $module.querySelectorAll('.govuk-accordion__section')
  this.browserSupportsSessionStorage = helper.checkForSessionStorage()

  var defaultConfig = {
    i18n: ACCORDION_TRANSLATIONS
  }
  this.config = mergeConfigs(
    defaultConfig,
    config || {},
    normaliseDataset($module.dataset)
  )
  this.i18n = new I18n(extractConfigByNamespace(this.config, 'i18n'))

  this.controlsClass = 'govuk-accordion__controls'
  this.showAllClass = 'govuk-accordion__show-all'
  this.showAllTextClass = 'govuk-accordion__show-all-text'

  this.sectionExpandedClass = 'govuk-accordion__section--expanded'
  this.sectionButtonClass = 'govuk-accordion__section-button'
  this.sectionHeaderClass = 'govuk-accordion__section-header'
  this.sectionHeadingClass = 'govuk-accordion__section-heading'
  this.sectionHeadingTextClass = 'govuk-accordion__section-heading-text'
  this.sectionHeadingTextFocusClass = 'govuk-accordion__section-heading-text-focus'

  this.sectionShowHideToggleClass = 'govuk-accordion__section-toggle'
  this.sectionShowHideToggleFocusClass = 'govuk-accordion__section-toggle-focus'
  this.sectionShowHideTextClass = 'govuk-accordion__section-toggle-text'
  this.upChevronIconClass = 'govuk-accordion-nav__chevron'
  this.downChevronIconClass = 'govuk-accordion-nav__chevron--down'

  this.sectionSummaryClass = 'govuk-accordion__section-summary'
  this.sectionSummaryFocusClass = 'govuk-accordion__section-summary-focus'
}

// Initialize component
Accordion.prototype.init = function () {
  // Check for module
  if (!this.$module) {
    return
  }

  this.initControls()
  this.initSectionHeaders()

  // See if "Show all sections" button text should be updated
  var areAllSectionsOpen = this.checkIfAllSectionsOpen()
  this.updateShowAllButton(areAllSectionsOpen)
}

// Initialise controls and set attributes
Accordion.prototype.initControls = function () {
  // Create "Show all" button and set attributes
  this.$showAllButton = document.createElement('button')
  this.$showAllButton.setAttribute('type', 'button')
  this.$showAllButton.setAttribute('class', this.showAllClass)
  this.$showAllButton.setAttribute('aria-expanded', 'false')

  // Create icon, add to element
  var $icon = document.createElement('span')
  $icon.classList.add(this.upChevronIconClass)
  this.$showAllButton.appendChild($icon)

  // Create control wrapper and add controls to it
  var $accordionControls = document.createElement('div')
  $accordionControls.setAttribute('class', this.controlsClass)
  $accordionControls.appendChild(this.$showAllButton)
  this.$module.insertBefore($accordionControls, this.$module.firstChild)

  // Build additional wrapper for Show all toggle text and place after icon
  var $wrappershowAllText = document.createElement('span')
  $wrappershowAllText.classList.add(this.showAllTextClass)
  this.$showAllButton.appendChild($wrappershowAllText)

  // Handle click events on the show/hide all button
  this.$showAllButton.addEventListener('click', this.onShowOrHideAllToggle.bind(this))
}

// Initialise section headers
Accordion.prototype.initSectionHeaders = function () {
  // Loop through section headers
  nodeListForEach(this.$sections, function ($section, i) {
    // Set header attributes
    var $header = $section.querySelector('.' + this.sectionHeaderClass)
    this.constructHeaderMarkup($header, i)
    this.setExpanded(this.isExpanded($section), $section)

    // Handle events
    $header.addEventListener('click', this.onSectionToggle.bind(this, $section))

    // See if there is any state stored in sessionStorage and set the sections to
    // open or closed.
    this.setInitialState($section)
  }.bind(this))
}

Accordion.prototype.constructHeaderMarkup = function ($headerWrapper, index) {
  var $span = $headerWrapper.querySelector('.' + this.sectionButtonClass)
  var $heading = $headerWrapper.querySelector('.' + this.sectionHeadingClass)
  var $summary = $headerWrapper.querySelector('.' + this.sectionSummaryClass)

  // Create a button element that will replace the '.govuk-accordion__section-button' span
  var $button = document.createElement('button')
  $button.setAttribute('type', 'button')
  $button.setAttribute('aria-controls', this.$module.id + '-content-' + (index + 1))

  // Copy all attributes (https://developer.mozilla.org/en-US/docs/Web/API/Element/attributes) from $span to $button
  for (var i = 0; i < $span.attributes.length; i++) {
    var attr = $span.attributes.item(i)
    // Add all attributes but not ID as this is being added to
    // the section heading ($headingText)
    if (attr.nodeName !== 'id') {
      $button.setAttribute(attr.nodeName, attr.nodeValue)
    }
  }

  // Create container for heading text so it can be styled
  var $headingText = document.createElement('span')
  $headingText.classList.add(this.sectionHeadingTextClass)
  // Copy the span ID to the heading text to allow it to be referenced by `aria-labelledby` on the
  // hidden content area without "Show this section"
  $headingText.id = $span.id

  // Create an inner heading text container to limit the width of the focus state
  var $headingTextFocus = document.createElement('span')
  $headingTextFocus.classList.add(this.sectionHeadingTextFocusClass)
  $headingText.appendChild($headingTextFocus)
  // span could contain HTML elements (see https://www.w3.org/TR/2011/WD-html5-20110525/content-models.html#phrasing-content)
  $headingTextFocus.innerHTML = $span.innerHTML

  // Create container for show / hide icons and text.
  var $showToggle = document.createElement('span')
  $showToggle.classList.add(this.sectionShowHideToggleClass)
  // Tell Google not to index the 'show' text as part of the heading
  // For the snippet to work with JavaScript, it must be added before adding the page element to the
  // page's DOM. See https://developers.google.com/search/docs/advanced/robots/robots_meta_tag#data-nosnippet-attr
  $showToggle.setAttribute('data-nosnippet', '')
  // Create an inner container to limit the width of the focus state
  var $showToggleFocus = document.createElement('span')
  $showToggleFocus.classList.add(this.sectionShowHideToggleFocusClass)
  $showToggle.appendChild($showToggleFocus)
  // Create wrapper for the show / hide text. Append text after the show/hide icon
  var $showToggleText = document.createElement('span')
  var $icon = document.createElement('span')
  $icon.classList.add(this.upChevronIconClass)
  $showToggleFocus.appendChild($icon)
  $showToggleText.classList.add(this.sectionShowHideTextClass)
  $showToggleFocus.appendChild($showToggleText)

  // Append elements to the button:
  // 1. Heading text
  // 2. Punctuation
  // 3. (Optional: Summary line followed by punctuation)
  // 4. Show / hide toggle
  $button.appendChild($headingText)
  $button.appendChild(this.getButtonPunctuationEl())

  // If summary content exists add to DOM in correct order
  if (typeof ($summary) !== 'undefined' && $summary !== null) {
    // Create a new `span` element and copy the summary line content from the original `div` to the
    // new `span`
    // This is because the summary line text is now inside a button element, which can only contain
    // phrasing content
    var $summarySpan = document.createElement('span')
    // Create an inner summary container to limit the width of the summary focus state
    var $summarySpanFocus = document.createElement('span')
    $summarySpanFocus.classList.add(this.sectionSummaryFocusClass)
    $summarySpan.appendChild($summarySpanFocus)

    // Get original attributes, and pass them to the replacement
    for (var j = 0, l = $summary.attributes.length; j < l; ++j) {
      var nodeName = $summary.attributes.item(j).nodeName
      var nodeValue = $summary.attributes.item(j).nodeValue
      $summarySpan.setAttribute(nodeName, nodeValue)
    }

    // Copy original contents of summary to the new summary span
    $summarySpanFocus.innerHTML = $summary.innerHTML

    // Replace the original summary `div` with the new summary `span`
    $summary.parentNode.replaceChild($summarySpan, $summary)

    $button.appendChild($summarySpan)
    $button.appendChild(this.getButtonPunctuationEl())
  }

  $button.appendChild($showToggle)

  $heading.removeChild($span)
  $heading.appendChild($button)
}

// When section toggled, set and store state
Accordion.prototype.onSectionToggle = function ($section) {
  var expanded = this.isExpanded($section)
  this.setExpanded(!expanded, $section)

  // Store the state in sessionStorage when a change is triggered
  this.storeState($section)
}

// When Open/Close All toggled, set and store state
Accordion.prototype.onShowOrHideAllToggle = function () {
  var $module = this
  var $sections = this.$sections
  var nowExpanded = !this.checkIfAllSectionsOpen()

  nodeListForEach($sections, function ($section) {
    $module.setExpanded(nowExpanded, $section)
    // Store the state in sessionStorage when a change is triggered
    $module.storeState($section)
  })

  $module.updateShowAllButton(nowExpanded)
}

// Set section attributes when opened/closed
Accordion.prototype.setExpanded = function (expanded, $section) {
  var $icon = $section.querySelector('.' + this.upChevronIconClass)
  var $showHideText = $section.querySelector('.' + this.sectionShowHideTextClass)
  var $button = $section.querySelector('.' + this.sectionButtonClass)
  var newButtonText = expanded
    ? this.i18n.t('hideSection')
    : this.i18n.t('showSection')

  $showHideText.innerText = newButtonText
  $button.setAttribute('aria-expanded', expanded)

  // Update aria-label combining
  var $header = $section.querySelector('.' + this.sectionHeadingTextClass)
  var ariaLabelParts = [$header.innerText.trim()]

  var $summary = $section.querySelector('.' + this.sectionSummaryClass)
  if ($summary) {
    ariaLabelParts.push($summary.innerText.trim())
  }

  var ariaLabelMessage = expanded
    ? this.i18n.t('hideSectionAriaLabel')
    : this.i18n.t('showSectionAriaLabel')
  ariaLabelParts.push(ariaLabelMessage)

  /*
   * Join with a comma to add pause for assistive technology.
   * Example: [heading]Section A ,[pause] Show this section.
   * https://accessibility.blog.gov.uk/2017/12/18/what-working-on-gov-uk-navigation-taught-us-about-accessibility/
   */
  $button.setAttribute('aria-label', ariaLabelParts.join(' , '))

  // Swap icon, change class
  if (expanded) {
    $section.classList.add(this.sectionExpandedClass)
    $icon.classList.remove(this.downChevronIconClass)
  } else {
    $section.classList.remove(this.sectionExpandedClass)
    $icon.classList.add(this.downChevronIconClass)
  }

  // See if "Show all sections" button text should be updated
  var areAllSectionsOpen = this.checkIfAllSectionsOpen()
  this.updateShowAllButton(areAllSectionsOpen)
}

// Get state of section
Accordion.prototype.isExpanded = function ($section) {
  return $section.classList.contains(this.sectionExpandedClass)
}

// Check if all sections are open
Accordion.prototype.checkIfAllSectionsOpen = function () {
  // Get a count of all the Accordion sections
  var sectionsCount = this.$sections.length
  // Get a count of all Accordion sections that are expanded
  var expandedSectionCount = this.$module.querySelectorAll('.' + this.sectionExpandedClass).length
  var areAllSectionsOpen = sectionsCount === expandedSectionCount

  return areAllSectionsOpen
}

// Update "Show all sections" button
Accordion.prototype.updateShowAllButton = function (expanded) {
  var $showAllIcon = this.$showAllButton.querySelector('.' + this.upChevronIconClass)
  var $showAllText = this.$showAllButton.querySelector('.' + this.showAllTextClass)
  var newButtonText = expanded
    ? this.i18n.t('hideAllSections')
    : this.i18n.t('showAllSections')
  this.$showAllButton.setAttribute('aria-expanded', expanded)
  $showAllText.innerText = newButtonText

  // Swap icon, toggle class
  if (expanded) {
    $showAllIcon.classList.remove(this.downChevronIconClass)
  } else {
    $showAllIcon.classList.add(this.downChevronIconClass)
  }
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
      return false
    }
  }
}

// Set the state of the accordions in sessionStorage
Accordion.prototype.storeState = function ($section) {
  if (this.browserSupportsSessionStorage) {
    // We need a unique way of identifying each content in the Accordion. Since
    // an `#id` should be unique and an `id` is required for `aria-` attributes
    // `id` can be safely used.
    var $button = $section.querySelector('.' + this.sectionButtonClass)

    if ($button) {
      var contentId = $button.getAttribute('aria-controls')
      var contentState = $button.getAttribute('aria-expanded')

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
    var $button = $section.querySelector('.' + this.sectionButtonClass)

    if ($button) {
      var contentId = $button.getAttribute('aria-controls')
      var contentState = contentId ? window.sessionStorage.getItem(contentId) : null

      if (contentState !== null) {
        this.setExpanded(contentState === 'true', $section)
      }
    }
  }
}

/**
 * Create an element to improve semantics of the section button with punctuation
 *
 * @returns {HTMLSpanElement} DOM element
 *
 * Adding punctuation to the button can also improve its general semantics by dividing its contents
 * into thematic chunks.
 * See https://github.com/alphagov/govuk-frontend/issues/2327#issuecomment-922957442
 */
Accordion.prototype.getButtonPunctuationEl = function () {
  var $punctuationEl = document.createElement('span')
  $punctuationEl.classList.add('govuk-visually-hidden', 'govuk-accordion__section-heading-divider')
  $punctuationEl.innerHTML = ', '
  return $punctuationEl
}

export default Accordion

/**
 * Accordion config
 *
 * @typedef {object} AccordionConfig
 * @property {AccordionTranslations} [i18n = ACCORDION_TRANSLATIONS] - See constant {@link ACCORDION_TRANSLATIONS}
 */

/**
 * Accordion translations
 *
 * @typedef {object} AccordionTranslations
 *
 * Messages used by the component for the labels of its buttons. This includes
 * the visible text shown on screen, and text to help assistive technology users
 * for the buttons toggling each section.
 * @property {string} [hideAllSections] - The text content for the 'Hide all
 * sections' button, used when at least one section is expanded.
 * @property {string} [hideSection] - The text content for the 'Hide'
 * button, used when a section is expanded.
 * @property {string} [hideSectionAriaLabel] - The text content appended to the
 * 'Hide' button's accessible name when a section is expanded.
 * @property {string} [showAllSections] - The text content for the 'Show all
 * sections' button, used when all sections are collapsed.
 * @property {string} [showSection] - The text content for the 'Show'
 * button, used when a section is collapsed.
 * @property {string} [showSectionAriaLabel] - The text content appended to the
 * 'Show' button's accessible name when a section is expanded.
 */
