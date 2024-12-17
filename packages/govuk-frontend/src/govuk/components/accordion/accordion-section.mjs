import { createElement } from '../../common/create-element.mjs'
import { Component } from '../../component.mjs'
import { ElementError } from '../../errors/index.mjs'

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
   */
  constructor($root) {
    super($root)

    this.$header = this.findRequiredElement(
      `.govuk-accordion__section-header`,
      `Section headers (\`<div class="govuk-accordion__section-header">\`)`
    )

    this.$buttonPlaceholder = this.findRequiredElement(
      '.govuk-accordion__section-button',
      'Section button placeholder (`<span class="govuk-accordion__section-button">`)'
    )

    this.$headingText = createHeadingText(this.$buttonPlaceholder)

    // Technically slightly different from the current implementation
    // However, I'm not sure we originally intended to check whether the content element
    // is present every time we toggle a section.
    // If that's the case, we can always wrap this in a setter
    this.$content = this.findRequiredElement(
      `.govuk-accordion__section-content`,
      `Section content (\`<div class="govuk-accordion__section-content">\`)`
    )

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

    const $summary = this.$root.querySelector(
      `.govuk-accordion__section-summary`
    )
    if ($summary) {
      this.$summary = createSummarySpan($summary)

      $summary.remove()
    }
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
 * Creates the `<span>` element with the summary for the section
 *
 * This is necessary because the summary line text is now inside
 * a button element, which can only contain phrasing content, and
 * not a `<div>` element
 *
 * @param {Element} $summary - The original `<div>` containing the summary
 * @returns {HTMLSpanElement} - The `<span>` element containing the summary
 */
function createSummarySpan($summary) {
  // Create an inner summary container to limit the width of the summary
  // focus state
  const $summarySpanFocus = createElement(
    'span',
    {
      class: 'govuk-accordion__section-summary-focus'
    },
    Array.from($summary.childNodes)
  )

  const $summarySpan = createElement('span', {}, [$summarySpanFocus])

  // Get original attributes, and pass them to the replacement
  for (const attr of Array.from($summary.attributes)) {
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
