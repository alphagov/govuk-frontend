import { normaliseDataset } from '../../common/normalise-dataset.mjs';
import { I18n } from '../../i18n.mjs';
import '../../vendor/polyfills/Element/prototype/classList.mjs';
import '../../vendor/polyfills/Event.mjs';
import '../../vendor/polyfills/Element/prototype/dataset.mjs';
import '../../vendor/polyfills/Function/prototype/bind.mjs';
import { nodeListForEach, mergeConfigs, extractConfigByNamespace } from '../../common/index.mjs';

/* eslint-disable es-x/no-function-prototype-bind -- Polyfill imported */

/**
 * @constant
 * @type {ExitThisPageTranslations}
 * @see Default value for {@link ExitThisPageConfig.i18n}
 * @default
 */
var EXIT_THIS_PAGE_TRANSLATIONS = {
  activated: 'Loading.',
  timedOut: 'Exit this page expired.',
  pressTwoMoreTimes: 'Shift, press 2 more times to exit.',
  pressOneMoreTime: 'Shift, press 1 more time to exit.'
};

/**
 * Exit This Page component
 *
 * @class
 * @param {HTMLElement} $module - HTML element that wraps the Exit This Page button
 * @param {ExitThisPageConfig} [config] - Exit This Page config
 */
function ExitThisPage ($module, config) {
  /** @type {ExitThisPageConfig} */
  var defaultConfig = {
    i18n: EXIT_THIS_PAGE_TRANSLATIONS
  };

  if (!($module instanceof HTMLElement)) {
    return this
  }

  var $button = $module.querySelector('.govuk-exit-this-page__button');
  if (!($button instanceof HTMLElement)) {
    return this
  }

  /**
   * @deprecated Will be made private in v5.0
   * @type {ExitThisPageConfig}
   */
  this.config = mergeConfigs(
    defaultConfig,
    config || {},
    normaliseDataset($module.dataset)
  );

  this.i18n = new I18n(extractConfigByNamespace(this.config, 'i18n'));

  /** @deprecated Will be made private in v5.0 */
  this.$module = $module;

  /** @deprecated Will be made private in v5.0 */
  this.$button = $button;

  /** @deprecated Will be made private in v5.0 */
  this.$skiplinkButton = document.querySelector('.govuk-js-exit-this-page-skiplink');

  /** @deprecated Will be made private in v5.0 */
  this.$updateSpan = null;

  /** @deprecated Will be made private in v5.0 */
  this.$indicatorContainer = null;

  /** @deprecated Will be made private in v5.0 */
  this.$overlay = null;

  /** @deprecated Will be made private in v5.0 */
  this.keypressCounter = 0;

  /** @deprecated Will be made private in v5.0 */
  this.lastKeyWasModified = false;

  /** @deprecated Will be made private in v5.0 */
  this.timeoutTime = 5000; // milliseconds

  // Store the timeout events so that we can clear them to avoid user keypresses overlapping
  // setTimeout returns an id that we can use to clear it with clearTimeout,
  // hence the 'Id' suffix

  /** @deprecated Will be made private in v5.0 */
  this.keypressTimeoutId = null;

  /** @deprecated Will be made private in v5.0 */
  this.timeoutMessageId = null;
}

/**
 * Create the <span> we use for screen reader announcements.
 *
 * @deprecated Will be made private in v5.0
 */
ExitThisPage.prototype.initUpdateSpan = function () {
  this.$updateSpan = document.createElement('span');
  this.$updateSpan.setAttribute('role', 'status');
  this.$updateSpan.className = 'govuk-visually-hidden';

  this.$module.appendChild(this.$updateSpan);
};

/**
 * Create button click handlers.
 *
 * @deprecated Will be made private in v5.0
 */
ExitThisPage.prototype.initButtonClickHandler = function () {
  // Main EtP button
  this.$button.addEventListener('click', this.handleClick.bind(this));

  // EtP skiplink
  if (this.$skiplinkButton) {
    this.$skiplinkButton.addEventListener('click', this.handleClick.bind(this));
  }
};

/**
 * Create the HTML for the 'three lights' indicator on the button.
 *
 * @deprecated Will be made private in v5.0
 */
ExitThisPage.prototype.buildIndicator = function () {
  // Build container
  // Putting `aria-hidden` on it as it won't contain any readable information
  this.$indicatorContainer = document.createElement('div');
  this.$indicatorContainer.className = 'govuk-exit-this-page__indicator';
  this.$indicatorContainer.setAttribute('aria-hidden', 'true');

  // Create three 'lights' and place them within the container
  for (var i = 0; i < 3; i++) {
    var $indicator = document.createElement('div');
    $indicator.className = 'govuk-exit-this-page__indicator-light';
    this.$indicatorContainer.appendChild($indicator);
  }

  // Append it all to the module
  this.$button.appendChild(this.$indicatorContainer);
};

/**
 * Update whether the lights are visible and which ones are lit up depending on
 * the value of `keypressCounter`.
 *
 * @deprecated Will be made private in v5.0
 */
ExitThisPage.prototype.updateIndicator = function () {
  // Show or hide the indicator container depending on keypressCounter value
  if (this.keypressCounter > 0) {
    this.$indicatorContainer.classList.add('govuk-exit-this-page__indicator--visible');
  } else {
    this.$indicatorContainer.classList.remove('govuk-exit-this-page__indicator--visible');
  }

  // Turn on only the indicators we want on
  var $indicators = this.$indicatorContainer.querySelectorAll(
    '.govuk-exit-this-page__indicator-light'
  );
  nodeListForEach($indicators, function ($indicator, index) {
    $indicator.classList.toggle(
      'govuk-exit-this-page__indicator-light--on',
      index < this.keypressCounter
    );
  }.bind(this));
};

/**
 * Initiates the redirection away from the current page.
 * Includes the loading overlay functionality, which covers the current page with a
 * white overlay so that the contents are not visible during the loading
 * process. This is particularly important on slow network connections.
 *
 * @deprecated Will be made private in v5.0
 */
ExitThisPage.prototype.exitPage = function () {
  this.$updateSpan.innerText = '';

  // Blank the page
  // As well as creating an overlay with text, we also set the body to hidden
  // to prevent screen reader and sequential navigation users potentially
  // navigating through the page behind the overlay during loading
  document.body.classList.add('govuk-exit-this-page-hide-content');
  this.$overlay = document.createElement('div');
  this.$overlay.className = 'govuk-exit-this-page-overlay';
  this.$overlay.setAttribute('role', 'alert');

  // we do these this way round, thus incurring a second paint, because changing
  // the element text after adding it means that screen readers pick up the
  // announcement more reliably.
  document.body.appendChild(this.$overlay);
  this.$overlay.innerText = this.i18n.t('activated');

  window.location.href = this.$button.getAttribute('href');
};

/**
 * Pre-activation logic for when the button is clicked/activated via mouse or
 * pointer.
 *
 * We do this to differentiate it from the keyboard activation event because we
 * need to run `e.preventDefault` as the button or skiplink are both links and we
 * want to apply some additional logic in `exitPage` before navigating.
 *
 * @deprecated Will be made private in v5.0
 * @param {MouseEvent} event - mouse click event
 */
ExitThisPage.prototype.handleClick = function (event) {
  event.preventDefault();
  this.exitPage();
};

/**
 * Logic for the 'quick escape' keyboard sequence functionality (pressing the
 * Shift key three times without interruption, within a time limit).
 *
 * @deprecated Will be made private in v5.0
 * @param {KeyboardEvent} event - keyup event
 */
ExitThisPage.prototype.handleKeypress = function (event) {
  // Detect if the 'Shift' key has been pressed. We want to only do things if it
  // was pressed by itself and not in a combination with another key—so we keep
  // track of whether the preceding keyup had shiftKey: true on it, and if it
  // did, we ignore the next Shift keyup event.
  //
  // This works because using Shift as a modifier key (e.g. pressing Shift + A)
  // will fire TWO keyup events, one for A (with e.shiftKey: true) and the other
  // for Shift (with e.shiftKey: false).
  if (
    (event.key === 'Shift' || event.keyCode === 16 || event.which === 16) &&
    !this.lastKeyWasModified
  ) {
    this.keypressCounter += 1;

    // Update the indicator before the below if statement can reset it back to 0
    this.updateIndicator();

    // Clear the timeout for the keypress timeout message clearing itself
    if (this.timeoutMessageId !== null) {
      clearTimeout(this.timeoutMessageId);
      this.timeoutMessageId = null;
    }

    if (this.keypressCounter >= 3) {
      this.keypressCounter = 0;

      if (this.keypressTimeoutId !== null) {
        clearTimeout(this.keypressTimeoutId);
        this.keypressTimeoutId = null;
      }

      this.exitPage();
    } else {
      if (this.keypressCounter === 1) {
        this.$updateSpan.innerText = this.i18n.t('pressTwoMoreTimes');
      } else {
        this.$updateSpan.innerText = this.i18n.t('pressOneMoreTime');
      }
    }

    this.setKeypressTimer();
  } else if (this.keypressTimeoutId !== null) {
    // If the user pressed any key other than 'Shift', after having pressed
    // 'Shift' and activating the timer, stop and reset the timer.
    this.resetKeypressTimer();
  }

  // Keep track of whether the Shift modifier key was held during this keypress
  this.lastKeyWasModified = event.shiftKey;
};

/**
 * Starts the 'quick escape' keyboard sequence timer.
 *
 * This can be invoked several times. We want this to be possible so that the
 * timer is restarted each time the shortcut key is pressed (e.g. the user has
 * up to n seconds between each keypress, rather than n seconds to invoke the
 * entire sequence.)
 *
 * @deprecated Will be made private in v5.0
 */
ExitThisPage.prototype.setKeypressTimer = function () {
  // Clear any existing timeout. This is so only one timer is running even if
  // there are multiple keypresses in quick succession.
  clearTimeout(this.keypressTimeoutId);

  // Set a fresh timeout
  this.keypressTimeoutId = setTimeout(
    this.resetKeypressTimer.bind(this),
    this.timeoutTime
  );
};

/**
 * Stops and resets the 'quick escape' keyboard sequence timer.
 *
 * @deprecated Will be made private in v5.0
 */
ExitThisPage.prototype.resetKeypressTimer = function () {
  clearTimeout(this.keypressTimeoutId);
  this.keypressTimeoutId = null;

  this.keypressCounter = 0;
  this.$updateSpan.innerText = this.i18n.t('timedOut');

  this.timeoutMessageId = setTimeout(function () {
    this.$updateSpan.innerText = '';
  }.bind(this), this.timeoutTime);

  this.updateIndicator();
};

/**
 * Reset the page using the EtP button
 *
 * We use this in situations where a user may re-enter a page using the browser
 * back button. In these cases, the browser can choose to restore the state of
 * the page as it was previously, including restoring the 'ghost page' overlay,
 * the announcement span having it's role set to "alert" and the keypress
 * indicator still active, leaving the page in an unusable state.
 *
 * By running this check when the page is shown, we can programatically restore
 * the page and the component to a "default" state
 *
 * @deprecated Will be made private in v5.0
 */
ExitThisPage.prototype.resetPage = function () {
  // If an overlay is set, remove it and reset the value
  document.body.classList.remove('govuk-exit-this-page-hide-content');

  if (this.$overlay) {
    this.$overlay.remove();
    this.$overlay = null;
  }

  // Ensure the announcement span's role is status, not alert and clear any text
  this.$updateSpan.setAttribute('role', 'status');
  this.$updateSpan.innerText = '';

  // Sync the keypress indicator lights
  this.updateIndicator();

  // If the timeouts are active, clear them
  if (this.keypressTimeoutId) {
    clearTimeout(this.keypressTimeoutId);
  }

  if (this.timeoutMessageId) {
    clearTimeout(this.timeoutMessageId);
  }
};

/**
 * Initialise component
 */
ExitThisPage.prototype.init = function () {
  this.buildIndicator();
  this.initUpdateSpan();
  this.initButtonClickHandler();

  // Check to see if this has already been done by a previous initialisation of ExitThisPage
  if (!('govukFrontendExitThisPageKeypress' in document.body.dataset)) {
    document.addEventListener('keyup', this.handleKeypress.bind(this), true);
    document.body.dataset.govukFrontendExitThisPageKeypress = 'true';
  }

  // When the page is restored after navigating 'back' in some browsers the
  // blank overlay remains present, rendering the page unusable. Here, we check
  // to see if it's present on page (re)load, and remove it if so.
  window.addEventListener(
    'onpageshow' in window ? 'pageshow' : 'DOMContentLoaded',
    this.resetPage.bind(this)
  );
};

/**
 * Exit this Page config
 *
 * @typedef {object} ExitThisPageConfig
 * @property {ExitThisPageTranslations} [i18n = EXIT_THIS_PAGE_TRANSLATIONS] - See constant {@link EXIT_THIS_PAGE_TRANSLATIONS}
 */

/**
 * Exit this Page translations
 *
 * @typedef {object} ExitThisPageTranslations
 *
 * Messages used by the component programatically inserted text, including
 * overlay text and screen reader announcements.
 * @property {string} [activated] - Screen reader announcement for when EtP
 *   keypress functionality has been successfully activated.
 * @property {string} [timedOut] - Screen reader announcement for when the EtP
 *   keypress functionality has timed out.
 * @property {string} [pressTwoMoreTimes] - Screen reader announcement informing
 *   the user they must press the activation key two more times.
 * @property {string} [pressOneMoreTime] - Screen reader announcement informing
 *   the user they must press the activation key one more time.
 */

export default ExitThisPage;
//# sourceMappingURL=components/exit-this-page/exit-this-page.mjs.map
