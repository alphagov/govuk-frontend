import { ElementError } from '../../errors/index.mjs'
import { GOVUKFrontendComponent } from '../../govuk-frontend-component.mjs'

/**
 * Details component
 *
 * @preserve
 */
export class Details extends GOVUKFrontendComponent {
  /** @private */
  $module

  /**
   * @param {Element | null} $module - HTML element to use for skip link
   * @throws {ElementError} when $module is not set or the wrong type
   * @throws {ElementError} when no summary element is present
   */
  constructor($module) {
    super()

    if (!($module instanceof HTMLDetailsElement)) {
      throw new ElementError({
        componentName: 'Details',
        element: $module,
        expectedType: 'HTMLAnchorElement',
        identifier: 'Root element (`$module`)'
      })
    }

    this.$module = $module
    this.$summary = this.$module.querySelector('.govuk-details__summary')

    if (!this.$summary) {
      throw new ElementError({
        componentName: 'Details',
        identifier:
          'Summary element (`<summary class="govuk-details__summary">`)'
      })
    }

    // It'd be nice to rely just on the detail's open attribute but using it
    // creates a race condition between the element getting clicked and the open
    // state being applied
    this.expandedState = this.$module.open

    // Give the summary a button role so that dragon recognises it.
    // This is a known issue with dragon and the details element and ideally would
    // be fixed at the vendor level.
    this.$summary.setAttribute('role', 'button')
    this.$summary.setAttribute('aria-expanded', this.expandedState.toString())

    this.$module.addEventListener('click', () => {
      this.$summary.setAttribute(
        'aria-expanded',
        (!this.expandedState).toString()
      )
      this.expandedState = !this.expandedState
    })
  }

  /**
   * Name for the component used when initialising using data-module attributes.
   */
  static moduleName = 'govuk-details'
}
