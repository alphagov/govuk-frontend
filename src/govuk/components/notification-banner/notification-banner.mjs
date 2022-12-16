import { mergeConfigs } from '../../common/index.mjs'
import { normaliseDataset } from '../../common/normalise-dataset.mjs'
import '../../vendor/polyfills/Event.mjs' // addEventListener, event.target normalization and DOMContentLoaded

/**
 * Notification Banner component
 *
 * @class
 * @param {HTMLElement} $module - HTML element to use for notification banner
 * @param {NotificationBannerConfig} [config] - Notification banner config
 */
function NotificationBanner ($module, config) {
  this.$module = $module

  var defaultConfig = {
    disableAutoFocus: false
  }
  this.config = mergeConfigs(
    defaultConfig,
    config || {},
    normaliseDataset($module.dataset)
  )
}

/**
 * Initialise component
 */
NotificationBanner.prototype.init = function () {
  var $module = this.$module
  // Check for module
  if (!$module) {
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
NotificationBanner.prototype.setFocus = function () {
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

export default NotificationBanner

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
