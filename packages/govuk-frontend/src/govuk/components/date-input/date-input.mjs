import { ElementError } from '../../errors/index.mjs'
import { GOVUKFrontendComponent } from '../../govuk-frontend-component.mjs'

/**
 * Date input component
 *
 * @preserve
 */
export class DateInput extends GOVUKFrontendComponent {
  /**
   * @param {Element} $module - HTML element to use for the date input
   */
  constructor($module) {
    super()

    if (!($module instanceof HTMLElement)) {
      throw new ElementError($module, {
        componentName: 'Date input',
        identifier: `[data-module="${DateInput.moduleName}"]`
      })
    }

    this.$module = $module
    this.$module.addEventListener('paste', (event) => this.handlePaste(event))

    /** @satisfies {NodeListOf<HTMLInputElement>} */
    this.$inputs = $module.querySelectorAll('input')
  }

  /**
   * @param {ClipboardEvent} event - event
   */
  handlePaste(event) {
    try {
      const clipboardData = event.clipboardData.getData('text')
      // eslint-disable-next-line es-x/no-regexp-named-capture-groups
      const regex =
        /(?<day>[0-9]{0,2})(?<separator>[ /.-])(?<month>[0-9]{0,2})\k<separator>(?<year>[0-9]{0,4})/

      let result

      if ((result = regex.exec(clipboardData))) {
        const parts = [
          result.groups.day,
          result.groups.month,
          result.groups.year
        ]

        this.$inputs.forEach(($input, index) => {
          $input.value = parts[index]
        })

        this.$inputs[this.$inputs.length - 1].focus()
        event.preventDefault()
      }
    } catch (error) {}
  }

  /**
   * Name for the component used when initialising using data-module attributes.
   */
  static moduleName = 'govuk-date-input'
}
