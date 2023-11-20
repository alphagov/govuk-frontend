import { mergeConfigs, extractConfigByNamespace } from '../../common/index.mjs'
import { normaliseDataset } from '../../common/normalise-dataset.mjs'
import { ElementError } from '../../errors/index.mjs'
import { GOVUKFrontendComponent } from '../../govuk-frontend-component.mjs'
import { I18n } from '../../i18n.mjs'

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
 * @preserve
 */
export class Accordion extends GOVUKFrontendComponent {
  /** @private */
  $module

  /**
   * @private
   * @type {AccordionConfig}
   */
  config

  /** @private */
  i18n

  /** @private */
  controlsClass = 'govuk-accordion__controls'

  /** @private */
  showAllClass = 'govuk-accordion__show-all'

  /** @private */
  showAllTextClass = 'govuk-accordion__show-all-text'

  /** @private */
  sectionClass = 'govuk-accordion__section'

  /** @private */
  sectionExpandedClass = 'govuk-accordion__section--expanded'

  /** @private */
  sectionButtonClass = 'govuk-accordion__section-button'

  /** @private */
  sectionHeaderClass = 'govuk-accordion__section-header'

  /** @private */
  sectionHeadingClass = 'govuk-accordion__section-heading'

  /** @private */
  sectionHeadingDividerClass = 'govuk-accordion__section-heading-divider'

  /** @private */
  sectionHeadingTextClass = 'govuk-accordion__section-heading-text'

  /** @private */
  sectionHeadingTextFocusClass = 'govuk-accordion__section-heading-text-focus'

  /** @private */
  sectionShowHideToggleClass = 'govuk-accordion__section-toggle'

  /** @private */
  sectionShowHideToggleFocusClass = 'govuk-accordion__section-toggle-focus'

  /** @private */
  sectionShowHideTextClass = 'govuk-accordion__section-toggle-text'

  /** @private */
  upChevronIconClass = 'govuk-accordion-nav__chevron'

  /** @private */
  downChevronIconClass = 'govuk-accordion-nav__chevron--down'

  /** @private */
  sectionSummaryClass = 'govuk-accordion__section-summary'

  /** @private */
  sectionSummaryFocusClass = 'govuk-accordion__section-summary-focus'

  /** @private */
  sectionContentClass = 'govuk-accordion__section-content'

  /** @private */
  $sections

  /** @private */
  browserSupportsSessionStorage = false

  /**
   * @private
   * @type {HTMLButtonElement | null}
   */
  $showAllButton = null

  /**
   * @private
   * @type {HTMLElement | null}
   */
  $showAllIcon = null

  /**
   * @private
   * @type {HTMLElement | null}
   */
  $showAllText = null

  /**
   * @param {Element | null} $module - HTML element to use for accordion
   * @param {AccordionConfig} [config] - Accordion config
   */
  constructor($module, config = {}) {
    super()

    if (!($module instanceof HTMLElement)) {
      throw new ElementError({
        componentName: 'Accordion',
        element: $module,
        identifier: 'Root element (`$module`)'
      })
    }

    this.$module = $module

    this.config = mergeConfigs(
      Accordion.defaults,
      config,
      normaliseDataset($module.dataset)
    )

    this.i18n = new I18n(extractConfigByNamespace(this.config, 'i18n'))

    const $sections = this.$module.querySelectorAll(`.${this.sectionClass}`)
    if (!$sections.length) {
      throw new ElementError({
        componentName: 'Accordion',
        identifier: `Sections (\`<div class="${this.sectionClass}">\`)`
      })
    }

    this.$sections = $sections
    this.browserSupportsSessionStorage = helper.checkForSessionStorage()

    this.initControls()
    this.initSectionHeaders()

    // See if "Show all sections" button text should be updated
    const areAllSectionsOpen = this.checkIfAllSectionsOpen()
    this.updateShowAllButton(areAllSectionsOpen)
  }

  /**
   * Initialise controls and set attributes
   *
   * @private
   */
  initControls() {
    // Create "Show all" button and set attributes
    this.$showAllButton = document.createElement('button')
    this.$showAllButton.setAttribute('type', 'button')
    this.$showAllButton.setAttribute('class', this.showAllClass)
    this.$showAllButton.setAttribute('aria-expanded', 'false')

    // Create icon, add to element
    this.$showAllIcon = document.createElement('span')
    this.$showAllIcon.classList.add(this.upChevronIconClass)
    this.$showAllButton.appendChild(this.$showAllIcon)

    // Create control wrapper and add controls to it
    const $accordionControls = document.createElement('div')
    $accordionControls.setAttribute('class', this.controlsClass)
    $accordionControls.appendChild(this.$showAllButton)
    this.$module.insertBefore($accordionControls, this.$module.firstChild)

    // Build additional wrapper for Show all toggle text and place after icon
    this.$showAllText = document.createElement('span')
    this.$showAllText.classList.add(this.showAllTextClass)
    this.$showAllButton.appendChild(this.$showAllText)

    // Handle click events on the show/hide all button
    this.$showAllButton.addEventListener('click', () =>
      this.onShowOrHideAllToggle()
    )

    // Handle 'beforematch' events, if the user agent supports them
    if ('onbeforematch' in document) {
      document.addEventListener('beforematch', (event) =>
        this.onBeforeMatch(event)
      )
    }
  }

  /**
   * Initialise section headers
   *
   * @private
   */
  initSectionHeaders() {
    this.$sections.forEach(($section, i) => {
      const $header = $section.querySelector(`.${this.sectionHeaderClass}`)
      if (!$header) {
        throw new ElementError({
          componentName: 'Accordion',
          identifier: `Section headers (\`<div class="${this.sectionHeaderClass}">\`)`
        })
      }

      // Set header attributes
      this.constructHeaderMarkup($header, i)
      this.setExpanded(this.isExpanded($section), $section)

      // Handle events
      $header.addEventListener('click', () => this.onSectionToggle($section))

      // See if there is any state stored in sessionStorage and set the sections
      // to open or closed.
      this.setInitialState($section)
    })
  }

  /**
   * Construct section header
   *
   * @private
   * @param {Element} $header - Section header
   * @param {number} index - Section index
   */
  constructHeaderMarkup($header, index) {
    const $span = $header.querySelector(`.${this.sectionButtonClass}`)
    const $heading = $header.querySelector(`.${this.sectionHeadingClass}`)
    const $summary = $header.querySelector(`.${this.sectionSummaryClass}`)

    if (!$heading) {
      throw new ElementError({
        componentName: 'Accordion',
        identifier: `Section heading (\`.${this.sectionHeadingClass}\`)`
      })
    }

    if (!$span) {
      throw new ElementError({
        componentName: 'Accordion',
        identifier: `Section button placeholder (\`<span class="${this.sectionButtonClass}">\`)`
      })
    }

    // Create a button element that will replace the
    // '.govuk-accordion__section-button' span
    const $button = document.createElement('button')
    $button.setAttribute('type', 'button')
    $button.setAttribute(
      'aria-controls',
      `${this.$module.id}-content-${index + 1}`
    )

    // Copy all attributes from $span to $button (except `id`, which gets added
    // to the `$headingText` element)
    for (const attr of Array.from($span.attributes)) {
      if (attr.nodeName !== 'id') {
        $button.setAttribute(attr.nodeName, `${attr.nodeValue}`)
      }
    }

    // Create container for heading text so it can be styled
    const $headingText = document.createElement('span')
    $headingText.classList.add(this.sectionHeadingTextClass)
    // Copy the span ID to the heading text to allow it to be referenced by
    // `aria-labelledby` on the hidden content area without "Show this section"
    $headingText.id = $span.id

    // Create an inner heading text container to limit the width of the focus
    // state
    const $headingTextFocus = document.createElement('span')
    $headingTextFocus.classList.add(this.sectionHeadingTextFocusClass)
    $headingText.appendChild($headingTextFocus)
    // span could contain HTML elements
    // (see https://www.w3.org/TR/2011/WD-html5-20110525/content-models.html#phrasing-content)
    $headingTextFocus.innerHTML = $span.innerHTML

    // Create container for show / hide icons and text.
    const $showHideToggle = document.createElement('span')
    $showHideToggle.classList.add(this.sectionShowHideToggleClass)
    // Tell Google not to index the 'show' text as part of the heading. Must be
    // set on the element before it's added to the DOM.
    // See https://developers.google.com/search/docs/advanced/robots/robots_meta_tag#data-nosnippet-attr
    $showHideToggle.setAttribute('data-nosnippet', '')
    // Create an inner container to limit the width of the focus state
    const $showHideToggleFocus = document.createElement('span')
    $showHideToggleFocus.classList.add(this.sectionShowHideToggleFocusClass)
    $showHideToggle.appendChild($showHideToggleFocus)
    // Create wrapper for the show / hide text. Append text after the show/hide icon
    const $showHideText = document.createElement('span')
    const $showHideIcon = document.createElement('span')
    $showHideIcon.classList.add(this.upChevronIconClass)
    $showHideToggleFocus.appendChild($showHideIcon)
    $showHideText.classList.add(this.sectionShowHideTextClass)
    $showHideToggleFocus.appendChild($showHideText)

    // Append elements to the button:
    // 1. Heading text
    // 2. Punctuation
    // 3. (Optional: Summary line followed by punctuation)
    // 4. Show / hide toggle
    $button.appendChild($headingText)
    $button.appendChild(this.getButtonPunctuationEl())

    // If summary content exists add to DOM in correct order
    if ($summary?.parentNode) {
      // Create a new `span` element and copy the summary line content from the
      // original `div` to the new `span`. This is because the summary line text
      // is now inside a button element, which can only contain phrasing
      // content.
      const $summarySpan = document.createElement('span')
      // Create an inner summary container to limit the width of the summary
      // focus state
      const $summarySpanFocus = document.createElement('span')
      $summarySpanFocus.classList.add(this.sectionSummaryFocusClass)
      $summarySpan.appendChild($summarySpanFocus)

      // Get original attributes, and pass them to the replacement
      for (const attr of Array.from($summary.attributes)) {
        $summarySpan.setAttribute(attr.nodeName, `${attr.nodeValue}`)
      }

      // Copy original contents of summary to the new summary span
      $summarySpanFocus.innerHTML = $summary.innerHTML

      // Replace the original summary `div` with the new summary `span`
      $summary.parentNode.replaceChild($summarySpan, $summary)

      $button.appendChild($summarySpan)
      $button.appendChild(this.getButtonPunctuationEl())
    }

    $button.appendChild($showHideToggle)

    $heading.removeChild($span)
    $heading.appendChild($button)
  }

  /**
   * When a section is opened by the user agent via the 'beforematch' event
   *
   * @private
   * @param {Event} event - Generic event
   */
  onBeforeMatch(event) {
    const $fragment = event.target

    // Handle elements with `.closest()` support only
    if (!($fragment instanceof Element)) {
      return
    }

    // Handle when fragment is inside section
    const $section = $fragment.closest(`.${this.sectionClass}`)
    if ($section) {
      this.setExpanded(true, $section)
    }
  }

  /**
   * When section toggled, set and store state
   *
   * @private
   * @param {Element} $section - Section element
   */
  onSectionToggle($section) {
    const expanded = this.isExpanded($section)
    this.setExpanded(!expanded, $section)

    // Store the state in sessionStorage when a change is triggered
    this.storeState($section)
  }

  /**
   * When Open/Close All toggled, set and store state
   *
   * @private
   */
  onShowOrHideAllToggle() {
    const nowExpanded = !this.checkIfAllSectionsOpen()

    this.$sections.forEach(($section) => {
      this.setExpanded(nowExpanded, $section)
      this.storeState($section)
    })

    this.updateShowAllButton(nowExpanded)
  }

  /**
   * Set section attributes when opened/closed
   *
   * @private
   * @param {boolean} expanded - Section expanded
   * @param {Element} $section - Section element
   */
  setExpanded(expanded, $section) {
    const $showHideIcon = $section.querySelector(`.${this.upChevronIconClass}`)
    const $showHideText = $section.querySelector(
      `.${this.sectionShowHideTextClass}`
    )
    const $button = $section.querySelector(`.${this.sectionButtonClass}`)
    const $content = $section.querySelector(`.${this.sectionContentClass}`)

    if (!$content) {
      throw new ElementError({
        componentName: 'Accordion',
        identifier: `Section content (\`<div class="${this.sectionContentClass}">\`)`
      })
    }

    if (!$showHideIcon || !$showHideText || !$button) {
      // Return early for elements we create
      return
    }

    const newButtonText = expanded
      ? this.i18n.t('hideSection')
      : this.i18n.t('showSection')

    $showHideText.textContent = newButtonText
    $button.setAttribute('aria-expanded', `${expanded}`)

    // Update aria-label combining
    const ariaLabelParts = []

    const $headingText = $section.querySelector(
      `.${this.sectionHeadingTextClass}`
    )
    if ($headingText) {
      ariaLabelParts.push(`${$headingText.textContent}`.trim())
    }

    const $summary = $section.querySelector(`.${this.sectionSummaryClass}`)
    if ($summary) {
      ariaLabelParts.push(`${$summary.textContent}`.trim())
    }

    const ariaLabelMessage = expanded
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
      $content.removeAttribute('hidden')
      $section.classList.add(this.sectionExpandedClass)
      $showHideIcon.classList.remove(this.downChevronIconClass)
    } else {
      $content.setAttribute('hidden', 'until-found')
      $section.classList.remove(this.sectionExpandedClass)
      $showHideIcon.classList.add(this.downChevronIconClass)
    }

    // See if "Show all sections" button text should be updated
    const areAllSectionsOpen = this.checkIfAllSectionsOpen()
    this.updateShowAllButton(areAllSectionsOpen)
  }

  /**
   * Get state of section
   *
   * @private
   * @param {Element} $section - Section element
   * @returns {boolean} True if expanded
   */
  isExpanded($section) {
    return $section.classList.contains(this.sectionExpandedClass)
  }

  /**
   * Check if all sections are open
   *
   * @private
   * @returns {boolean} True if all sections are open
   */
  checkIfAllSectionsOpen() {
    const sectionsCount = this.$sections.length
    const expandedSectionCount = this.$module.querySelectorAll(
      `.${this.sectionExpandedClass}`
    ).length
    const areAllSectionsOpen = sectionsCount === expandedSectionCount

    return areAllSectionsOpen
  }

  /**
   * Update "Show all sections" button
   *
   * @private
   * @param {boolean} expanded - Section expanded
   */
  updateShowAllButton(expanded) {
    if (!this.$showAllButton || !this.$showAllText || !this.$showAllIcon) {
      return
    }

    this.$showAllButton.setAttribute('aria-expanded', expanded.toString())
    this.$showAllText.textContent = expanded
      ? this.i18n.t('hideAllSections')
      : this.i18n.t('showAllSections')
    this.$showAllIcon.classList.toggle(this.downChevronIconClass, !expanded)
  }

  /**
   * Set the state of the accordions in sessionStorage
   *
   * @private
   * @param {Element} $section - Section element
   */
  storeState($section) {
    if (this.browserSupportsSessionStorage && this.config.rememberExpanded) {
      // We need a unique way of identifying each content in the Accordion.
      // Since an `#id` should be unique and an `id` is required for `aria-`
      // attributes `id` can be safely used.
      const $button = $section.querySelector(`.${this.sectionButtonClass}`)

      if ($button) {
        const contentId = $button.getAttribute('aria-controls')
        const contentState = $button.getAttribute('aria-expanded')

        // Only set the state when both `contentId` and `contentState` are taken
        // from the DOM.
        if (contentId && contentState) {
          window.sessionStorage.setItem(contentId, contentState)
        }
      }
    }
  }

  /**
   * Read the state of the accordions from sessionStorage
   *
   * @private
   * @param {Element} $section - Section element
   */
  setInitialState($section) {
    if (this.browserSupportsSessionStorage && this.config.rememberExpanded) {
      const $button = $section.querySelector(`.${this.sectionButtonClass}`)

      if ($button) {
        const contentId = $button.getAttribute('aria-controls')
        const contentState = contentId
          ? window.sessionStorage.getItem(contentId)
          : null

        if (contentState !== null) {
          this.setExpanded(contentState === 'true', $section)
        }
      }
    }
  }

  /**
   * Create an element to improve semantics of the section button with
   * punctuation
   *
   * Adding punctuation to the button can also improve its general semantics by
   * dividing its contents into thematic chunks. See
   * https://github.com/alphagov/govuk-frontend/issues/2327#issuecomment-922957442
   *
   * @private
   * @returns {Element} DOM element
   */
  getButtonPunctuationEl() {
    const $punctuationEl = document.createElement('span')
    $punctuationEl.classList.add(
      'govuk-visually-hidden',
      this.sectionHeadingDividerClass
    )
    $punctuationEl.innerHTML = ', '
    return $punctuationEl
  }

  /**
   * Name for the component used when initialising using data-module attributes.
   */
  static moduleName = 'govuk-accordion'

  /**
   * Accordion default config
   *
   * @see {@link AccordionConfig}
   * @constant
   * @type {AccordionConfig}
   */
  static defaults = Object.freeze({
    i18n: {
      hideAllSections: 'Hide all sections',
      hideSection: 'Hide',
      hideSectionAriaLabel: 'Hide this section',
      showAllSections: 'Show all sections',
      showSection: 'Show',
      showSectionAriaLabel: 'Show this section'
    },
    rememberExpanded: true
  })
}

const helper = {
  /**
   * Check for `window.sessionStorage`, and that it actually works.
   *
   * @returns {boolean} True if session storage is available
   */
  checkForSessionStorage: function () {
    const testString = 'this is the test string'
    let result
    try {
      window.sessionStorage.setItem(testString, testString)
      result =
        window.sessionStorage.getItem(testString) === testString.toString()
      window.sessionStorage.removeItem(testString)
      return result
    } catch (exception) {
      return false
    }
  }
}

/**
 * Accordion config
 *
 * @see {@link Accordion.defaults}
 * @typedef {object} AccordionConfig
 * @property {AccordionTranslations} [i18n=Accordion.defaults.i18n] - Accordion translations
 * @property {boolean} [rememberExpanded] - Whether the expanded and collapsed
 *   state of each section is remembered and restored when navigating.
 */

/**
 * Accordion translations
 *
 * @see {@link Accordion.defaults.i18n}
 * @typedef {object} AccordionTranslations
 *
 * Messages used by the component for the labels of its buttons. This includes
 * the visible text shown on screen, and text to help assistive technology users
 * for the buttons toggling each section.
 * @property {string} [hideAllSections] - The text content for the 'Hide all
 *   sections' button, used when at least one section is expanded.
 * @property {string} [hideSection] - The text content for the 'Hide'
 *   button, used when a section is expanded.
 * @property {string} [hideSectionAriaLabel] - The text content appended to the
 *   'Hide' button's accessible name when a section is expanded.
 * @property {string} [showAllSections] - The text content for the 'Show all
 *   sections' button, used when all sections are collapsed.
 * @property {string} [showSection] - The text content for the 'Show'
 *   button, used when a section is collapsed.
 * @property {string} [showSectionAriaLabel] - The text content appended to the
 *   'Show' button's accessible name when a section is expanded.
 */
