import '../../vendor/polyfills/Element/prototype/classList'

function NotificationBanner ($module) {
  this.$module = $module
}

// Initialise component
NotificationBanner.prototype.init = function () {
  var $module = this.$module
  // Check for module
  if (!$module) {
    return
  }

  // Focus the element when the HTML document has loaded
  window.addEventListener('DOMContentLoaded', this.setFocus.bind(this))
}

/**
 * Auto focus element
 *
 * Move focus to the element to ensure that it is announced to the user (in addition, the component
 * HTML sets `role="alert"` for increased visibility to assistive technologies).
 *
 * Scroll to the element in the viewport.
 *
 * Call this function *after* the DOMContentLoaded event is fired to ensure correct scroll position.
 *
 * You can turn off the auto-focus functionality by removing the `data-auto-focus` attribute
 * from the component HTML. You might wish to do this based on user research findings, or to avoid
 * a clash with another element which should be focused when the page loads.
 */
NotificationBanner.prototype.setFocus = function () {
  var $module = this.$module

  // Check if the attribute that determines whether the element should be auto-focused is present
  if ($module.getAttribute('data-auto-focus') !== 'true') {
    return
  }

  // Check if role="alert" is set
  if ($module.getAttribute('role') !== 'alert') {
    return
  }

  // Check that there isn't an error summary on the page, or that another notification banner
  // hasn't already received focus
  var anotherElementFocused = this.checkIfAnotherElementFocused()
  if (anotherElementFocused) {
    return
  }

  // Scroll the notification banner into view *before* calling focus on it to
  // avoid extra scrolling in browsers that don't support `preventScroll` (which
  // at time of writing is most of them...)
  this.$module.scrollIntoView()
  this.$module.focus({ preventScroll: true })
}

/**
 * Check for other focused elements on the page
 *
 * Prevent auto-focusing the notification banner if there is an error summary on the page.
 *
 * Prevent auto-focusing a notification banner if another notification banner is already focused.
 * This means that the first notification banner on the page that auto-focus is enabled for gets
 * focus. (This guards against teams inadvertently including multiple notification banners on the
 * page which auto-focus).
 * */
NotificationBanner.prototype.checkIfAnotherElementFocused = function () {
  if (!document.activeElement) {
    return
  }

  var errorSummaryPresent = document.querySelector('[data-module="govuk-error-summary"]')
  var anotherNotificationFocused = document.activeElement.classList.contains('govuk-notification-banner')

  return errorSummaryPresent || anotherNotificationFocused
}

export default NotificationBanner
