import { withConfiguration } from '../../common/class/mixins/withConfiguration.mjs'
import { mixOnto } from '../../common/class/mixins.mjs'
import '../../vendor/polyfills/Event.mjs' // addEventListener, event.target normalization and DOMContentLoaded
import BaseComponent from '../base-component.mjs'

const DEFAULT_CONFIGURATION = {
  disableAutoFocus: false
}

/**
 * Notification Banner component
 *
 * @class
 * @param {HTMLElement} $module - HTML element to use for notification banner
 * @param {NotificationBannerConfig} [config] - Notification banner config
 */
export default class NotificationBanner extends mixOnto(BaseComponent, withConfiguration(DEFAULT_CONFIGURATION)) {
  /**
   * Initialise component
   */
  init () {
    if (!this.$module) {
      return
    }

    this.setFocus()
  }

  /**
   * Focus the element
   *
   * If `role="alert"` is set, focus the element to help some assistive technologies
   * prioritise announcing it.
   *
   * You can turn off the auto-focus functionality by setting `data-disable-auto-focus="true"` in the
   * component HTML. You might wish to do this based on user research findings, or to avoid a clash
   * with another element which should be focused when the page loads.
   */
  setFocus () {
    var $module = this.$module

    if (this.config.disableAutoFocus) {
      return
    }

    if ($module.getAttribute('role') !== 'alert') {
      return
    }

    // Set tabindex to -1 to make the element focusable with JavaScript.
    // Remove the tabindex on blur as the component doesn't need to be focusable after the page has
    // loaded.
    if (!$module.getAttribute('tabindex')) {
      $module.setAttribute('tabindex', '-1')

      $module.addEventListener('blur', function () {
        $module.removeAttribute('tabindex')
      })
    }

    $module.focus()
  }
}

/**
 * Notification banner config
 *
 * @typedef {object} NotificationBannerConfig
 * @property {boolean} [disableAutoFocus = false] -
 *   If set to `true` the notification banner will not be focussed when the page
 *   loads. This only applies if the component has a `role` of `alert` – in
 *   other cases the component will not be focused on page load, regardless of
 *   this option.
 */
