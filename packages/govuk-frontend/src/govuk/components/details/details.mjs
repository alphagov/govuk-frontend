// eslint-disable-next-line
// @ts-nocheck
import { ElementError } from '../../errors/index.mjs'
import { GOVUKFrontendComponent } from '../../govuk-frontend-component.mjs'

const KEY_ENTER = 13
const KEY_SPACE = 32

/**
 * Details component
 *
 * @preserve
 */
export class Details extends GOVUKFrontendComponent {
  /**
   * Details component constructor
   *
   * @param {Element | null} $module - HTML element to use for details
   */
  constructor($module) {
    super()

    if (!($module instanceof HTMLElement)) {
      throw new ElementError({
        componentName: 'Details',
        element: $module,
        identifier: 'Root element (`$module`)'
      })
    }

    this.$module = $module
    this.$summary = this.$module.getElementsByTagName('summary').item(0)
    this.$content = this.$module.getElementsByTagName('div').item(0)

    // If <details> doesn't have a <summary> and a <div> representing the content
    // it means the required HTML structure is not met so the script will stop
    if (!this.$summary || !this.$content) {
      return
    }

    // If the content doesn't have an ID, assign it one now
    // which we'll need for the summary's aria-controls assignment
    if (!this.$content.id) {
      this.$content.id = `details-content-${this.generateUniqueID()}`
    }

    // Add ARIA role="group" to details
    this.$module.setAttribute('role', 'group')

    // Add role=button to summary
    this.$summary.setAttribute('role', 'button')

    // Add aria-controls
    this.$summary.setAttribute('aria-controls', this.$content.id)

    // Set tabIndex so the summary is keyboard accessible for non-native elements
    //
    // We have to use the camelcase `tabIndex` property as there is a bug in IE6/IE7 when we set the correct attribute lowercase:
    // See http://web.archive.org/web/20170120194036/http://www.saliences.com/browserBugs/tabIndex.html for more information.
    this.$summary.tabIndex = 0

    // Detect initial open state
    if (this.$module.hasAttribute('open')) {
      this.$summary.setAttribute('aria-expanded', 'true')
    } else {
      this.$summary.setAttribute('aria-expanded', 'false')
    }

    // Bind an event to handle summary elements
    this.polyfillHandleInputs(() => this.polyfillSetAttributes())
  }

  /**
   * Define a statechange function that updates aria-expanded and style.display
   *
   * @private
   * @returns {boolean} Returns true
   */
  polyfillSetAttributes() {
    console.log('Hello!')
    if (this.$module.hasAttribute('open')) {
      console.log('Closing')
      // @
      this.$summary.setAttribute('aria-expanded', 'false')
      // this.$content.style.display = 'none'
    } else {
      console.log('Opening')
      // @
      this.$summary.setAttribute('aria-expanded', 'true')
      // this.$content.style.display = ''
    }

    return true
  }

  /**
   * Handle cross-modal click events
   *
   * @private
   * @param {(event: UIEvent) => void} callback - function
   */
  polyfillHandleInputs(callback) {
    // @
    this.$summary.addEventListener('keypress', (event) => {
      const $target = event.target
      // When the key gets pressed - check if it is enter or space
      if (event.keyCode === KEY_ENTER || event.keyCode === KEY_SPACE) {
        if (
          $target instanceof HTMLElement &&
          $target.nodeName.toLowerCase() === 'summary'
        ) {
          // Prevent space from scrolling the page
          // and enter from submitting a form
          event.preventDefault()
          // Click to let the click event do all the necessary action
          // eslint-disable-next-line
          if ($target.click) {
            $target.click()
          } else {
            // except Safari 5.1 and under don't support .click() here
            callback(event)
          }
        }
      }
    })

    // Prevent keyup to prevent clicking twice in Firefox when using space key
    // @
    this.$summary.addEventListener('keyup', (event) => {
      const $target = event.target
      if (event.keyCode === KEY_SPACE) {
        if (
          $target instanceof HTMLElement &&
          $target.nodeName.toLowerCase() === 'summary'
        ) {
          event.preventDefault()
        }
      }
    })

    // @
    this.$summary.addEventListener('click', callback)
  }

  /**
   * Used to generate a unique string, allows multiple instances of the component
   * without them conflicting with each other.
   * https://stackoverflow.com/a/8809472
   *
   * @private
   * @returns {string} Unique ID
   */
  generateUniqueID() {
    let d = new Date().getTime()
    if (
      typeof window.performance !== 'undefined' &&
      typeof window.performance.now === 'function'
    ) {
      d += window.performance.now() // use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
      }
    )
  }

  /**
   * Name for the component used when initialising using data-module attributes.
   */
  static moduleName = 'govuk-details'
}
