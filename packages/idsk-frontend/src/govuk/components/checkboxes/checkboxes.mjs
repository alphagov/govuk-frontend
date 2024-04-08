import { ElementError } from '../../errors/index.mjs'
import { GOVUKFrontendComponent } from '../../govuk-frontend-component.mjs'

/**
 * Checkboxes component
 *
 * @preserve
 */
export class Checkboxes extends GOVUKFrontendComponent {
  /** @private */
  $module

  /** @private */
  $inputs

  /**
   * Checkboxes can be associated with a 'conditionally revealed' content block
   * – for example, a checkbox for 'Phone' could reveal an additional form field
   * for the user to enter their phone number.
   *
   * These associations are made using a `data-aria-controls` attribute, which
   * is promoted to an aria-controls attribute during initialisation.
   *
   * We also need to restore the state of any conditional reveals on the page
   * (for example if the user has navigated back), and set up event handlers to
   * keep the reveal in sync with the checkbox state.
   *
   * @param {Element | null} $module - HTML element to use for checkboxes
   */
  constructor($module) {
    super()

    if (!($module instanceof HTMLElement)) {
      throw new ElementError({
        componentName: 'Checkboxes',
        element: $module,
        identifier: 'Root element (`$module`)'
      })
    }

    const $inputs = $module.querySelectorAll('input[type="checkbox"]')
    if (!$inputs.length) {
      throw new ElementError({
        componentName: 'Checkboxes',
        identifier: 'Form inputs (`<input type="checkbox">`)'
      })
    }

    this.$module = $module
    this.$inputs = $inputs

    this.$inputs.forEach(($input) => {
      const targetId = $input.getAttribute('data-aria-controls')

      // Skip radios without data-aria-controls attributes
      if (!targetId) {
        return
      }

      // Throw if target conditional element does not exist.
      if (!document.getElementById(targetId)) {
        throw new ElementError({
          componentName: 'Checkboxes',
          identifier: `Conditional reveal (\`id="${targetId}"\`)`
        })
      }

      // Promote the data-aria-controls attribute to a aria-controls attribute
      // so that the relationship is exposed in the AOM
      $input.setAttribute('aria-controls', targetId)
      $input.removeAttribute('data-aria-controls')
    })

    // When the page is restored after navigating 'back' in some browsers the
    // state of form controls is not restored until *after* the DOMContentLoaded
    // event is fired, so we need to sync after the pageshow event.
    window.addEventListener('pageshow', () => this.syncAllConditionalReveals())

    // Although we've set up handlers to sync state on the pageshow event, init
    // could be called after those events have fired, for example if they are
    // added to the page dynamically, so sync now too.
    this.syncAllConditionalReveals()

    // Handle events
    this.$module.addEventListener('click', (event) => this.handleClick(event))
  }

  /**
   * Sync the conditional reveal states for all checkboxes in this $module.
   *
   * @private
   */
  syncAllConditionalReveals() {
    this.$inputs.forEach(($input) =>
      this.syncConditionalRevealWithInputState($input)
    )
  }

  /**
   * Sync conditional reveal with the input state
   *
   * Synchronise the visibility of the conditional reveal, and its accessible
   * state, with the input's checked state.
   *
   * @private
   * @param {HTMLInputElement} $input - Checkbox input
   */
  syncConditionalRevealWithInputState($input) {
    const targetId = $input.getAttribute('aria-controls')
    if (!targetId) {
      return
    }

    const $target = document.getElementById(targetId)
    if (
      $target &&
      $target.classList.contains('govuk-checkboxes__conditional')
    ) {
      const inputIsChecked = $input.checked

      $input.setAttribute('aria-expanded', inputIsChecked.toString())
      $target.classList.toggle(
        'govuk-checkboxes__conditional--hidden',
        !inputIsChecked
      )
    }
  }

  /**
   * Uncheck other checkboxes
   *
   * Find any other checkbox inputs with the same name value, and uncheck them.
   * This is useful for when a “None of these" checkbox is checked.
   *
   * @private
   * @param {HTMLInputElement} $input - Checkbox input
   */
  unCheckAllInputsExcept($input) {
    const allInputsWithSameName = document.querySelectorAll(
      `input[type="checkbox"][name="${$input.name}"]`
    )

    allInputsWithSameName.forEach(($inputWithSameName) => {
      const hasSameFormOwner = $input.form === $inputWithSameName.form
      if (hasSameFormOwner && $inputWithSameName !== $input) {
        $inputWithSameName.checked = false
        this.syncConditionalRevealWithInputState($inputWithSameName)
      }
    })
  }

  /**
   * Uncheck exclusive checkboxes
   *
   * Find any checkbox inputs with the same name value and the 'exclusive'
   * behaviour, and uncheck them. This helps prevent someone checking both a
   * regular checkbox and a "None of these" checkbox in the same fieldset.
   *
   * @private
   * @param {HTMLInputElement} $input - Checkbox input
   */
  unCheckExclusiveInputs($input) {
    const allInputsWithSameNameAndExclusiveBehaviour =
      document.querySelectorAll(
        `input[data-behaviour="exclusive"][type="checkbox"][name="${$input.name}"]`
      )

    allInputsWithSameNameAndExclusiveBehaviour.forEach(($exclusiveInput) => {
      const hasSameFormOwner = $input.form === $exclusiveInput.form
      if (hasSameFormOwner) {
        $exclusiveInput.checked = false
        this.syncConditionalRevealWithInputState($exclusiveInput)
      }
    })
  }

  /**
   * Click event handler
   *
   * Handle a click within the $module – if the click occurred on a checkbox,
   * sync the state of any associated conditional reveal with the checkbox
   * state.
   *
   * @private
   * @param {MouseEvent} event - Click event
   */
  handleClick(event) {
    const $clickedInput = event.target

    // Ignore clicks on things that aren't checkbox inputs
    if (
      !($clickedInput instanceof HTMLInputElement) ||
      $clickedInput.type !== 'checkbox'
    ) {
      return
    }

    // If the checkbox conditionally-reveals some content, sync the state
    const hasAriaControls = $clickedInput.getAttribute('aria-controls')
    if (hasAriaControls) {
      this.syncConditionalRevealWithInputState($clickedInput)
    }

    // No further behaviour needed for unchecking
    if (!$clickedInput.checked) {
      return
    }

    // Handle 'exclusive' checkbox behaviour (ie "None of these")
    const hasBehaviourExclusive =
      $clickedInput.getAttribute('data-behaviour') === 'exclusive'
    if (hasBehaviourExclusive) {
      this.unCheckAllInputsExcept($clickedInput)
    } else {
      this.unCheckExclusiveInputs($clickedInput)
    }
  }

  /**
   * Name for the component used when initialising using data-module attributes.
   */
  static moduleName = 'govuk-checkboxes'
}
