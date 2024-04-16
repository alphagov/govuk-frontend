import { ElementError } from '../../errors/index.mjs'
import { GOVUKFrontendComponent } from '../../govuk-frontend-component.mjs'

/**
 * Radios component
 *
 * @preserve
 */
export class Radios extends GOVUKFrontendComponent {
  /** @private */
  $module

  /** @private */
  $inputs

  /**
   * Radios can be associated with a 'conditionally revealed' content block –
   * for example, a radio for 'Phone' could reveal an additional form field for
   * the user to enter their phone number.
   *
   * These associations are made using a `data-aria-controls` attribute, which
   * is promoted to an aria-controls attribute during initialisation.
   *
   * We also need to restore the state of any conditional reveals on the page
   * (for example if the user has navigated back), and set up event handlers to
   * keep the reveal in sync with the radio state.
   *
   * @param {Element | null} $module - HTML element to use for radios
   */
  constructor($module) {
    super()

    if (!($module instanceof HTMLElement)) {
      throw new ElementError({
        componentName: 'Radios',
        element: $module,
        identifier: 'Root element (`$module`)'
      })
    }

    const $inputs = $module.querySelectorAll('input[type="radio"]')
    if (!$inputs.length) {
      throw new ElementError({
        componentName: 'Radios',
        identifier: 'Form inputs (`<input type="radio">`)'
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
          componentName: 'Radios',
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
   * Sync the conditional reveal states for all radio buttons in this $module.
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
   * @param {HTMLInputElement} $input - Radio input
   */
  syncConditionalRevealWithInputState($input) {
    const targetId = $input.getAttribute('aria-controls')
    if (!targetId) {
      return
    }

    const $target = document.getElementById(targetId)
    if ($target?.classList.contains('govuk-radios__conditional')) {
      const inputIsChecked = $input.checked

      $input.setAttribute('aria-expanded', inputIsChecked.toString())
      $target.classList.toggle(
        'govuk-radios__conditional--hidden',
        !inputIsChecked
      )
    }
  }

  /**
   * Click event handler
   *
   * Handle a click within the $module – if the click occurred on a radio, sync
   * the state of the conditional reveal for all radio buttons in the same form
   * with the same name (because checking one radio could have un-checked a
   * radio in another $module)
   *
   * @private
   * @param {MouseEvent} event - Click event
   */
  handleClick(event) {
    const $clickedInput = event.target

    // Ignore clicks on things that aren't radio buttons
    if (
      !($clickedInput instanceof HTMLInputElement) ||
      $clickedInput.type !== 'radio'
    ) {
      return
    }

    // We only need to consider radios with conditional reveals, which will have
    // aria-controls attributes.
    const $allInputs = document.querySelectorAll(
      'input[type="radio"][aria-controls]'
    )

    const $clickedInputForm = $clickedInput.form
    const $clickedInputName = $clickedInput.name

    $allInputs.forEach(($input) => {
      const hasSameFormOwner = $input.form === $clickedInputForm
      const hasSameName = $input.name === $clickedInputName

      if (hasSameName && hasSameFormOwner) {
        this.syncConditionalRevealWithInputState($input)
      }
    })
  }

  /**
   * Name for the component used when initialising using data-module attributes.
   */
  static moduleName = 'govuk-radios'
}
