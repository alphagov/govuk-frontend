import { mergeConfigs, setFocus } from '../../common/index.mjs'
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
    super($module)

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
      normaliseDataset(NotificationBanner, $module.dataset)
    )

    /**
     * Focus the notification banner
     *
     * If `role="alert"` is set, focus the element to help some assistive
     * technologies prioritise announcing it.
     *
     * You can turn off the auto-focus functionality by setting
     * `data-disable-auto-focus="true"` in the component HTML. You might wish to
     * do this based on user research findings, or to avoid a clash with another
     * element which should be focused when the page loads.
     */
    if (
      this.$module.getAttribute('role') === 'alert' &&
      !this.config.disableAutoFocus
    ) {
      setFocus(this.$module)
    }
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

  /**
   * Notification banner config schema
   *
   * @constant
   * @satisfies {Schema}
   */
  static schema = Object.freeze({
    properties: {
      disableAutoFocus: { type: 'boolean' }
    }
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

/**
 * @typedef {import('../../common/index.mjs').Schema} Schema
 */
