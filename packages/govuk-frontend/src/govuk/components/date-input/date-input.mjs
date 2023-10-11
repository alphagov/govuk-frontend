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
    const clipboardData = event.clipboardData.getData('text')
    const regex = /([0-9]{1,2})([/\-.])([0-9]{1,2}|[A-Z]+)([/\-.])([0-9]{1,4})/

    let result

    if ((result = regex.exec(clipboardData))) {
      console.log(result)

      const [, day, firstSeparator, month, secondSeperator, year] = result

      if (firstSeparator !== secondSeperator) {
        return
      }

      const parts = [day, month, year]

      this.$inputs.forEach(($input, index) => {
        $input.value = parts[index]
      })

      this.$inputs[this.$inputs.length - 1].focus()
      event.preventDefault()
    }
  }

  /**
   * Name for the component used when initialising using data-module attributes.
   */
  static moduleName = 'govuk-date-input'
}
