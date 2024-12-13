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

    this.$header = this.$root.querySelector(`.govuk-accordion__section-header`)
    if (!this.$header) {
      throw new ElementError({
        component: AccordionSection,
        identifier: `Section headers (\`<div class="govuk-accordion__section-header">\`)`
      })
    }

    this.$toggleIcon = createElement('span', {
      class: 'govuk-accordion-nav__chevron'
    })

    this.$toggleText = createElement('span', {
      class: 'govuk-accordion__section-toggle-text'
    })

    this.$toggle = createShowHideToggle(this.$toggleIcon, this.$toggleText)
  }
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
