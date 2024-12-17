import { ConfigurableComponent } from '../../common/configuration.mjs'
import { createElement } from '../../common/create-element.mjs'
import { ElementError } from '../../errors/index.mjs'
import { I18n } from '../../i18n.mjs'

import { AccordionSection } from './accordion-section.mjs'

/** @private */
const sectionClass = 'govuk-accordion__section'

/** @private */
const sectionExpandedModifier = 'govuk-accordion__section--expanded'

/** @private */
const sectionButtonClass = 'govuk-accordion__section-button'

/** @private */
const iconClass = 'govuk-accordion-nav__chevron'

/** @private */
const iconOpenModifier = 'govuk-accordion-nav__chevron--down'

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
 * @augments ConfigurableComponent<AccordionConfig>
 */
export class Accordion extends ConfigurableComponent {
  /** @private */
  i18n

  /** @private */
  $sections

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
   * @param {Element | null} $root - HTML element to use for accordion
   * @param {AccordionConfig} [config] - Accordion config
   */
  constructor($root, config = {}) {
    super($root, config)

    this.i18n = new I18n(this.config.i18n)

    const $sections = this.$root.querySelectorAll(`.${sectionClass}`)
    if (!$sections.length) {
      throw new ElementError({
        component: Accordion,
        identifier: `Sections (\`<div class="${sectionClass}">\`)`
      })
    }

    this.$sections = $sections
    // This will help access the sections from their element
    // hopefully only while migrating code to AccordionSection
    // but possibly later.
    /** @type {Map<Element,AccordionSection>} */
    this.sections = new Map()

    this.initControls()
    this.initSectionHeaders()

    this.updateShowAllButton(this.areAllSectionsOpen())
  }

  /**
   * Initialise controls and set attributes
   *
   * @private
   */
  initControls() {
    // Create "Show all" button and set attributes
    this.$showAllButton = createElement('button', {
      type: 'button',
      class: 'govuk-accordion__show-all',
      'aria-expanded': 'false'
    })

    // Create icon, add to element
    this.$showAllIcon = createElement('span', {
      class: iconClass
    })
    this.$showAllButton.appendChild(this.$showAllIcon)

    // Create control wrapper and add controls to it
    const $accordionControls = createElement('div', {
      class: 'govuk-accordion__controls'
    })
    $accordionControls.appendChild(this.$showAllButton)
    this.$root.insertBefore($accordionControls, this.$root.firstChild)

    // Build additional wrapper for Show all toggle text and place after icon
    this.$showAllText = createElement('span', {
      class: 'govuk-accordion__show-all-text'
    })
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
    this.$sections.forEach(($section, index) => {
      const section = new AccordionSection($section, {
        accordionId: this.$root.id,
        index
      })
      // Cache the AccordionSection for future retrieval
      this.sections.set($section, section)

      // Set header attributes
      this.constructHeaderMarkup(section, index)
      this.setExpanded(this.isExpanded($section), $section)

      // Handle events
      section.$header.addEventListener('click', () =>
        this.onSectionToggle($section)
      )

      // See if there is any state stored in sessionStorage and set the sections
      // to open or closed.
      this.setInitialState($section)
    })
  }

  /**
   * Construct section header
   *
   * @private
   * @param {AccordionSection} section - The section to build the header for
   * @param {number} index - Section index
   */
  constructHeaderMarkup(section, index) {
    // Create a button element that will replace the
    // '.govuk-accordion__section-button' span
    const $button = createElement('button', {
      type: 'button',
      'aria-controls': `${this.$root.id}-content-${index + 1}`
    })

    // Copy all attributes from $span to $button (except `id`, which gets added
    // to the `$headingText` element)
    for (const attr of Array.from(section.$buttonPlaceholder.attributes)) {
      if (attr.name !== 'id') {
        $button.setAttribute(attr.name, attr.value)
      }
    }

    // Append elements to the button:
    // 1. Heading text
    // 2. Punctuation
    // 3. (Optional: Summary line followed by punctuation)
    // 4. Show / hide toggle
    $button.appendChild(section.$headingText)
    $button.appendChild(this.getButtonPunctuationEl())

    // If summary content exists add to DOM in correct order
    if (section.$summary) {
      $button.appendChild(section.$summary)
      $button.appendChild(this.getButtonPunctuationEl())
    }

    $button.appendChild(section.$toggle)

    section.$heading.removeChild(section.$buttonPlaceholder)
    section.$heading.appendChild($button)
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
    const $section = $fragment.closest(`.${sectionClass}`)
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
    const nowExpanded = !this.isExpanded($section)
    this.setExpanded(nowExpanded, $section)

    // Store the state in sessionStorage when a change is triggered
    this.storeState($section, nowExpanded)
  }

  /**
   * When Open/Close All toggled, set and store state
   *
   * @private
   */
  onShowOrHideAllToggle() {
    const nowExpanded = !this.areAllSectionsOpen()

    this.$sections.forEach(($section) => {
      this.setExpanded(nowExpanded, $section)
      this.storeState($section, nowExpanded)
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
    // TEMPORARY: Access the section until the `expanded` state
    // is handled inside the `AccordionSection` itself
    const section = this.sections.get($section)
    if (!section) {
      return
    }

    const $showHideIcon = section.$toggleIcon
    const $showHideText = section.$toggleText
    const $button = $section.querySelector(`.${sectionButtonClass}`)
    const $content = section.$content

    if (!$button) {
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

    ariaLabelParts.push(`${section.$headingText.textContent}`.trim())

    if (section.$summary) {
      ariaLabelParts.push(`${section.$summary.textContent}`.trim())
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
      $section.classList.add(sectionExpandedModifier)
      $showHideIcon.classList.remove(iconOpenModifier)
    } else {
      $content.setAttribute('hidden', 'until-found')
      $section.classList.remove(sectionExpandedModifier)
      $showHideIcon.classList.add(iconOpenModifier)
    }

    // See if "Show all sections" button text should be updated
    this.updateShowAllButton(this.areAllSectionsOpen())
  }

  /**
   * Get state of section
   *
   * @private
   * @param {Element} $section - Section element
   * @returns {boolean} True if expanded
   */
  isExpanded($section) {
    return $section.classList.contains(sectionExpandedModifier)
  }

  /**
   * Check if all sections are open
   *
   * @private
   * @returns {boolean} True if all sections are open
   */
  areAllSectionsOpen() {
    return Array.from(this.$sections).every(($section) =>
      this.isExpanded($section)
    )
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
    this.$showAllIcon.classList.toggle(iconOpenModifier, !expanded)
  }

  /**
   * Get the identifier for a section
   *
   * We need a unique way of identifying each content in the Accordion.
   * Since an `#id` should be unique and an `id` is required for `aria-`
   * attributes `id` can be safely used.
   *
   * @param {Element} $section - Section element
   * @returns {string | undefined | null} Identifier for section
   */
  getIdentifier($section) {
    // TODO: Temporary, this should be lifted once the accordion
    // all section related features as within `AccordionSection`
    const section = this.sections.get($section)
    return section?.contentId
  }

  /**
   * Set the state of the accordions in sessionStorage
   *
   * @private
   * @param {Element} $section - Section element
   * @param {boolean} isExpanded - Whether the section is expanded
   */
  storeState($section, isExpanded) {
    if (!this.config.rememberExpanded) {
      return
    }

    const id = this.getIdentifier($section)

    if (id) {
      try {
        window.sessionStorage.setItem(id, isExpanded.toString())
      } catch (exception) {}
    }
  }

  /**
   * Read the state of the accordions from sessionStorage
   *
   * @private
   * @param {Element} $section - Section element
   */
  setInitialState($section) {
    if (!this.config.rememberExpanded) {
      return
    }

    const id = this.getIdentifier($section)

    if (id) {
      try {
        const state = window.sessionStorage.getItem(id)

        if (state !== null) {
          this.setExpanded(state === 'true', $section)
        }
      } catch (exception) {}
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
    const $element = createElement('span', {
      class: 'govuk-visually-hidden govuk-accordion__section-heading-divider'
    })

    $element.textContent = ', '
    return $element
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

  /**
   * Accordion config schema
   *
   * @constant
   * @satisfies {Schema<AccordionConfig>}
   */
  static schema = Object.freeze({
    properties: {
      i18n: { type: 'object' },
      rememberExpanded: { type: 'boolean' }
    }
  })
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

/**
 * @import { Schema } from '../../common/configuration.mjs'
 */
