import { mergeConfigs } from '../../common/index.mjs'
import { normaliseDataset } from '../../common/normalise-dataset.mjs'
import { ElementError } from '../../errors/index.mjs'
import { GOVUKFrontendComponent } from '../../govuk-frontend-component.mjs'

/**
 * Notification Banner component
 *
 * @preserve
 */
export class NotificationBanner extends GOVUKFrontendComponent {
  /** @private */
  $module

  /**
   * @private
   * @type {NotificationBannerConfig}
   */
  config

  /**
   * @param {Element | null} $module - HTML element to use for notification banner
   * @param {NotificationBannerConfig} [config] - Notification banner config
   */
  constructor($module, config = {}) {
    super()

    if (!($module instanceof HTMLElement)) {
      throw new ElementError({
        componentName: 'Notification banner',
        element: $module,
        identifier: 'Root element (`$module`)'
      })
    }

    this.$module = $module

    this.config = mergeConfigs(
      NotificationBanner.defaults,
      config,
      normaliseDataset($module.dataset)
    )

    this.setFocus()
  }

  /**
   * Focus the element
   *
   * If `role="alert"` is set, focus the element to help some assistive
   * technologies prioritise announcing it.
   *
   * You can turn off the auto-focus functionality by setting
   * `data-disable-auto-focus="true"` in the component HTML. You might wish to
   * do this based on user research findings, or to avoid a clash with another
   * element which should be focused when the page loads.
   *
   * @private
   */
  setFocus() {
    if (this.config.disableAutoFocus) {
      return
    }

    if (this.$module.getAttribute('role') !== 'alert') {
      return
    }

    // Set tabindex to -1 to make the element focusable with JavaScript. Remove
    // the tabindex on blur as the component doesn't need to be focusable after
    // the page has loaded.
    if (!this.$module.getAttribute('tabindex')) {
      this.$module.setAttribute('tabindex', '-1')

      this.$module.addEventListener('blur', () => {
        this.$module.removeAttribute('tabindex')
      })
    }

    this.$module.focus()
  }

  /**
   * Name for the component used when initialising using data-module attributes.
   */
  static moduleName = 'govuk-notification-banner'

  /**
   * Notification banner default config
   *
   * @see {@link NotificationBannerConfig}
   * @constant
   * @type {NotificationBannerConfig}
   */
  static defaults = Object.freeze({
    disableAutoFocus: false
  })
}

/**
 * Notification banner config
 *
 * @typedef {object} NotificationBannerConfig
 * @property {boolean} [disableAutoFocus=false] - If set to `true` the
 *   notification banner will not be focussed when the page loads. This only
 *   applies if the component has a `role` of `alert` – in other cases the
 *   component will not be focused on page load, regardless of this option.
 */
