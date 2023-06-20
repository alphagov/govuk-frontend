/**
 * Radios component
 */
export class Radios {
  /** @private */
  $module

  /** @private */
  $inputs

  /**
   * @param {Element} $module - HTML element to use for radios
   */
  constructor ($module) {
    if (!($module instanceof HTMLElement) || !document.body.classList.contains('govuk-frontend-supported')) {
      return this
    }

    /** @satisfies {NodeListOf<HTMLInputElement>} */
    const $inputs = $module.querySelectorAll('input[type="radio"]')
    if (!$inputs.length) {
      return this
    }

    this.$module = $module
    this.$inputs = $inputs
  }

  /**
   * Initialise component
   *
   * Radios can be associated with a 'conditionally revealed' content block – for
   * example, a radio for 'Phone' could reveal an additional form field for the
   * user to enter their phone number.
   *
   * These associations are made using a `data-aria-controls` attribute, which is
   * promoted to an aria-controls attribute during initialisation.
   *
   * We also need to restore the state of any conditional reveals on the page (for
   * example if the user has navigated back), and set up event handlers to keep
   * the reveal in sync with the radio state.
   *
   * @returns {Promise<Radios>} Radios component
   */
  async init () {
    // Check that required elements are present
    if (!this.$module || !this.$inputs) {
      throw new Error("Component 'Radios' is missing '$module' or '$inputs' fields")
    }

    this.$inputs.forEach(($input) => {
      const targetId = $input.getAttribute('data-aria-controls')

      // Skip radios without data-aria-controls attributes, or where the
      // target element does not exist.
      if (!targetId || !document.getElementById(targetId)) {
        return
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

    return Promise.resolve(this)
  }

  /**
   * Sync the conditional reveal states for all radio buttons in this $module.
   *
   * @private
   */
  syncAllConditionalReveals () {
    this.$inputs.forEach(($input) => this.syncConditionalRevealWithInputState($input))
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
  syncConditionalRevealWithInputState ($input) {
    const targetId = $input.getAttribute('aria-controls')
    if (!targetId) {
      return
    }

    const $target = document.getElementById(targetId)
    if ($target && $target.classList.contains('govuk-radios__conditional')) {
      const inputIsChecked = $input.checked

      $input.setAttribute('aria-expanded', inputIsChecked.toString())
      $target.classList.toggle('govuk-radios__conditional--hidden', !inputIsChecked)
    }
  }

  /**
   * Click event handler
   *
   * Handle a click within the $module – if the click occurred on a radio, sync
   * the state of the conditional reveal for all radio buttons in the same form
   * with the same name (because checking one radio could have un-checked a radio
   * in another $module)
   *
   * @private
   * @param {MouseEvent} event - Click event
   */
  handleClick (event) {
    const $clickedInput = event.target

    // Ignore clicks on things that aren't radio buttons
    if (!($clickedInput instanceof HTMLInputElement) || $clickedInput.type !== 'radio') {
      return
    }

    // We only need to consider radios with conditional reveals, which will have
    // aria-controls attributes.
    /** @satisfies {NodeListOf<HTMLInputElement>} */
    const $allInputs = document.querySelectorAll('input[type="radio"][aria-controls]')

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
}
