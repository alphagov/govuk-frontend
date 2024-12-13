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
  }
}
