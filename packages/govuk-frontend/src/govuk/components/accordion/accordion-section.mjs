import { createElement } from '../../common/create-element.mjs'
import { Component } from '../../component.mjs'
import { ElementError } from '../../errors/index.mjs'

/** @internal */
export const sectionExpandedModifier = 'govuk-accordion__section--expanded'

/** @private */
const iconOpenModifier = 'govuk-accordion-nav__chevron--down'

/**
 * A section of the Accordion component
 *
 * Encapsulates responsibilities linked to a singular section,
 * rather than the whole accordion like:
 * - accessing key elements of the section
 */
export class AccordionSection extends Component {
  static moduleName = 'govuk-accordion-section'

  /**
   * @param {Element} $root - The root of the section
   * @param {AccordionSectionConfig} config - The configuration for this AccordionSection
   */
  constructor($root, { i18n }) {
    super($root)

    this.i18n = i18n

    this.ariaLabelParts = []

    this.$header = this.findRequiredElement(
      `.govuk-accordion__section-header`,
      `Section headers (\`<div class="govuk-accordion__section-header">\`)`
    )

    const $buttonPlaceholder = this.findRequiredElement(
      '.govuk-accordion__section-button',
      'Section button placeholder (`<span class="govuk-accordion__section-button">`)'
    )

    const $headingText = createHeadingText($buttonPlaceholder)
    this.ariaLabelParts.push($headingText.textContent.trim())

    // Technically slightly different from the current implementation
    // However, I'm not sure we originally intended to check whether the content element
    // is present every time we toggle a section.
    // If that's the case, we can always wrap this in a setter
    this.$content = this.findRequiredElement(
      `.govuk-accordion__section-content`,
      `Section content (\`<div class="govuk-accordion__section-content">\`)`
    )

    if (!this.$content.id) {
      throw new ElementError({
        component: AccordionSection,
        identifier:
          'Section content (`<div class="govuk-accordion__section-content">`) attribute (`id`)'
      })
    }

    this.$toggleIcon = createElement('span', {
      class: 'govuk-accordion-nav__chevron'
    })

    this.$toggleText = createElement('span', {
      class: 'govuk-accordion__section-toggle-text'
    })

    this.$toggle = createShowHideToggle(this.$toggleIcon, this.$toggleText)

    this.$heading = this.findRequiredElement(
      '.govuk-accordion__section-heading',
      'Section heading (`.govuk-accordion__section-heading`)'
    )

    const $summaryDiv = this.$root.querySelector(
      `.govuk-accordion__section-summary`
    )
    let $summarySpan
    if ($summaryDiv) {
      this.ariaLabelParts.push($summaryDiv.textContent.trim())

      $summarySpan = createSummarySpan($summaryDiv)
      $summaryDiv.remove()
    }

    this.$button = this.constructHeaderMarkup({
      $buttonPlaceholder,
      $headingText,
      $summarySpan
    })

    this.$heading.removeChild($buttonPlaceholder)
    this.$heading.appendChild(this.$button)
  }

  /**
   * @returns {string} The `id` of the element with the section's content
   */
  get contentId() {
    return this.$content.id
  }

  /**
   * @returns {boolean} Whether the section is expanded
   */
  get expanded() {
    return this.$root.classList.contains(sectionExpandedModifier)
  }

  /**
   * @param {boolean} value - Whether the section is expanded
   */
  set expanded(value) {
    this.$root.classList.toggle(sectionExpandedModifier, value)

    this.render(value)
  }

  /**
   * @param {boolean} expanded - Whether the section is expanded
   */
  render(expanded) {
    const newButtonText = expanded
      ? this.i18n.t('hideSection')
      : this.i18n.t('showSection')

    this.$toggleText.textContent = newButtonText
    this.$button.setAttribute('aria-expanded', `${expanded}`)

    // Update aria-label combining
    const ariaLabelParts = [].concat(this.ariaLabelParts)

    const ariaLabelMessage = expanded
      ? this.i18n.t('hideSectionAriaLabel')
      : this.i18n.t('showSectionAriaLabel')
    ariaLabelParts.push(ariaLabelMessage)

    /*
     * Join with a comma to add pause for assistive technology.
     * Example: [heading]Section A ,[pause] Show this section.
     * https://accessibility.blog.gov.uk/2017/12/18/what-working-on-gov-uk-navigation-taught-us-about-accessibility/
     */
    this.$button.setAttribute('aria-label', ariaLabelParts.join(' , '))

    // Swap icon, change class
    if (expanded) {
      this.$content.removeAttribute('hidden')
      this.$toggleIcon.classList.remove(iconOpenModifier)
    } else {
      this.$content.setAttribute('hidden', 'until-found')
      this.$toggleIcon.classList.add(iconOpenModifier)
    }
  }

  /**
   * Construct section header
   *
   * @private
   * @param {object} options - Function options
   * @param {Element} options.$buttonPlaceholder - The button placeholder
   * @param {Element} options.$headingText - The element with the text of the heading
   * @param {Element} [options.$summarySpan] - The element with the summary
   * @returns {HTMLButtonElement} - The button element
   */
  constructHeaderMarkup({ $buttonPlaceholder, $headingText, $summarySpan }) {
    // Create a button element that will replace the
    // '.govuk-accordion__section-button' span
    const $button = createElement('button', {
      type: 'button',
      'aria-controls': this.$content.id
    })

    // Copy all attributes from $span to $button (except `id`, which gets added
    // to the `$headingText` element)
    for (const attr of Array.from($buttonPlaceholder.attributes)) {
      if (attr.name !== 'id') {
        $button.setAttribute(attr.name, attr.value)
      }
    }

    // Append elements to the button:
    // 1. Heading text
    // 2. Punctuation
    // 3. (Optional: Summary line followed by punctuation)
    // 4. Show / hide toggle
    $button.appendChild($headingText)
    $button.appendChild(createVisuallyHiddenComma())

    // If summary content exists add to DOM in correct order
    if ($summarySpan) {
      $button.appendChild($summarySpan)
      $button.appendChild(createVisuallyHiddenComma())
    }

    $button.appendChild(this.$toggle)

    return $button
  }

  /**
   * Finds a require element under the component's root
   *
   * Throws if the element does not exist
   *
   * @param {string} selector - The selector to use for looking up the element
   * @param {string} identifier - A message that'll help user identify the element if it's missing
   * @returns {Element} - The element
   * @throws {ElementError} - If the element is not present
   */
  findRequiredElement(selector, identifier) {
    const $element = this.$root.querySelector(selector)

    if (!$element) {
      throw new ElementError({
        component: AccordionSection,
        identifier
      })
    }

    return $element
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
function createVisuallyHiddenComma() {
  const $element = createElement('span', {
    class: 'govuk-visually-hidden govuk-accordion__section-heading-divider'
  })

  $element.textContent = ', '
  return $element
}

/**
 * Creates the `<span>` element with the summary for the section
 *
 * This is necessary because the summary line text is now inside
 * a button element, which can only contain phrasing content, and
 * not a `<div>` element
 *
 * @param {Element} $summaryDiv - The original `<div>` containing the summary
 * @returns {HTMLSpanElement} - The `<span>` element containing the summary
 */
function createSummarySpan($summaryDiv) {
  // Create an inner summary container to limit the width of the summary
  // focus state
  const $summarySpanFocus = createElement(
    'span',
    {
      class: 'govuk-accordion__section-summary-focus'
    },
    Array.from($summaryDiv.childNodes)
  )

  const $summarySpan = createElement('span', {}, [$summarySpanFocus])

  // Get original attributes, and pass them to the replacement
  for (const attr of Array.from($summaryDiv.attributes)) {
    $summarySpan.setAttribute(attr.name, attr.value)
  }

  return $summarySpan
}

/**
 * Creates the `<span>` containing the text of the section's heading
 *
 * @param {Element} $buttonPlaceholder - The heading of the span
 * @returns {HTMLSpanElement} - The `<span>` containing the text of the section's heading
 */
function createHeadingText($buttonPlaceholder) {
  // Create an inner heading text container to limit the width of the focus
  // state
  const $headingTextFocus = createElement(
    'span',
    {
      class: 'govuk-accordion__section-heading-text-focus'
    },
    // span could contain HTML elements which need moving to the new span
    // (see https://www.w3.org/TR/2011/WD-html5-20110525/content-models.html#phrasing-content)
    Array.from($buttonPlaceholder.childNodes)
  )

  // Create container for heading text so it can be styled
  const $headingText = createElement(
    'span',
    {
      class: 'govuk-accordion__section-heading-text',
      id: $buttonPlaceholder.id
    },
    [$headingTextFocus]
  )

  return $headingText
}

/**
 * Creates a `<span>` rendering the 'Show'/'Hide' toggle
 *
 * @param {Node} $toggleIcon - The element for the toggle's icon
 * @param {Node} $toggleText - The element for the toggle's text
 * @returns {HTMLSpanElement} - The `<span>` with the visual representation of the 'Show/Hide' toggle
 */
function createShowHideToggle($toggleIcon, $toggleText) {
  // Create an inner container to limit the width of the focus state
  const $showHideToggleFocus = createElement(
    'span',
    {
      class: 'govuk-accordion__section-toggle-focus'
    },
    [$toggleIcon, $toggleText]
  )

  const $showHideToggle = createElement(
    'span',
    {
      class: 'govuk-accordion__section-toggle',
      // Tell Google not to index the 'show' text as part of the heading. Must be
      // set on the element before it's added to the DOM.
      // See https://developers.google.com/search/docs/advanced/robots/robots_meta_tag#data-nosnippet-attr
      'data-nosnippet': ''
    },
    [$showHideToggleFocus]
  )

  return $showHideToggle
}

/**
 * @typedef AccordionSectionConfig
 * @property {I18n} i18n - The i18n instance of the Accordion the section belongs to
 */

/**
 * @import {I18n} from '../../i18n.mjs'
 */
