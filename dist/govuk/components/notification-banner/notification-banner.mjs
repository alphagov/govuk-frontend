import { ConfigurableComponent } from '../../common/configuration.mjs';
import { setFocus } from '../../common/index.mjs';

/**
 * Notification Banner component
 *
 * @preserve
 * @augments ConfigurableComponent<NotificationBannerConfig>
 */
class NotificationBanner extends ConfigurableComponent {
  /**
   * @param {Element | null} $root - HTML element to use for notification banner
   * @param {NotificationBannerConfig} [config] - Notification banner config
   */
  constructor($root, config = {}) {
    super($root, config);
    if (this.$root.getAttribute('role') === 'alert' && !this.config.disableAutoFocus) {
      setFocus(this.$root);
    }
  }
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
 * @typedef {import('../../common/configuration.mjs').Schema} Schema
 */
NotificationBanner.moduleName = 'govuk-notification-banner';
NotificationBanner.defaults = Object.freeze({
  disableAutoFocus: false
});
NotificationBanner.schema = Object.freeze({
  properties: {
    disableAutoFocus: {
      type: 'boolean'
    }
  }
});

export { NotificationBanner };
//# sourceMappingURL=notification-banner.mjs.map
