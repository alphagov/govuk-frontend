import { mergeConfigs, setFocus } from '../../common/index.mjs';
import { normaliseDataset } from '../../common/normalise-dataset.mjs';
import { GOVUKFrontendComponent } from '../../govuk-frontend-component.mjs';

/**
 * Notification Banner component
 *
 * @preserve
 */
class NotificationBanner extends GOVUKFrontendComponent {
  /**
   * @param {Element | null} $root - HTML element to use for notification banner
   * @param {NotificationBannerConfig} [config] - Notification banner config
   */
  constructor($root, config = {}) {
    super($root);
    this.config = void 0;
    this.config = mergeConfigs(NotificationBanner.defaults, config, normaliseDataset(NotificationBanner, this.$root.dataset));
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
 * @typedef {import('../../common/index.mjs').Schema} Schema
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
