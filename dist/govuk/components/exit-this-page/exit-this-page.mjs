import { mergeConfigs, extractConfigByNamespace } from '../../common/index.mjs';
import { normaliseDataset } from '../../common/normalise-dataset.mjs';
import { ElementError } from '../../errors/index.mjs';
import { GOVUKFrontendComponent } from '../../govuk-frontend-component.mjs';
import { I18n } from '../../i18n.mjs';

/**
 * Exit this page component
 *
 * @preserve
 */
class ExitThisPage extends GOVUKFrontendComponent {
  /**
   * @param {Element} $module - HTML element that wraps the Exit This Page button
   * @param {ExitThisPageConfig} [config] - Exit This Page config
   */
  constructor($module, config) {
    super();
    this.$module = void 0;
    this.config = void 0;
    this.i18n = void 0;
    this.$button = void 0;
    this.$skiplinkButton = null;
    this.$updateSpan = null;
    this.$indicatorContainer = null;
    this.$overlay = null;
    this.keypressCounter = 0;
    this.lastKeyWasModified = false;
    this.timeoutTime = 5000;
    this.keypressTimeoutId = null;
    this.timeoutMessageId = null;
    if (!($module instanceof HTMLElement)) {
      throw new ElementError($module, {
        componentName: 'Exit this page',
        identifier: '$module'
      });
    }
    const $button = $module.querySelector('.govuk-exit-this-page__button');
    if (!($button instanceof HTMLElement)) {
      throw new ElementError($button, {
        componentName: 'Exit this page',
        identifier: 'Button',
        expectedType: HTMLElement
      });
    }
    this.config = mergeConfigs(ExitThisPage.defaults, config || {}, normaliseDataset($module.dataset));
    this.i18n = new I18n(extractConfigByNamespace(this.config, 'i18n'));
    this.$module = $module;
    this.$button = $button;
    const $skiplinkButton = document.querySelector('.govuk-js-exit-this-page-skiplink');
    if ($skiplinkButton instanceof HTMLAnchorElement) {
      this.$skiplinkButton = $skiplinkButton;
    }
    this.buildIndicator();
    this.initUpdateSpan();
    this.initButtonClickHandler();
    if (!('govukFrontendExitThisPageKeypress' in document.body.dataset)) {
      document.addEventListener('keyup', this.handleKeypress.bind(this), true);
      document.body.dataset.govukFrontendExitThisPageKeypress = 'true';
    }
    window.addEventListener('pageshow', this.resetPage.bind(this));
  }
  initUpdateSpan() {
    this.$updateSpan = document.createElement('span');
    this.$updateSpan.setAttribute('role', 'status');
    this.$updateSpan.className = 'govuk-visually-hidden';
    this.$module.appendChild(this.$updateSpan);
  }
  initButtonClickHandler() {
    this.$button.addEventListener('click', this.handleClick.bind(this));
    if (this.$skiplinkButton) {
      this.$skiplinkButton.addEventListener('click', this.handleClick.bind(this));
    }
  }
  buildIndicator() {
    this.$indicatorContainer = document.createElement('div');
    this.$indicatorContainer.className = 'govuk-exit-this-page__indicator';
    this.$indicatorContainer.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 3; i++) {
      const $indicator = document.createElement('div');
      $indicator.className = 'govuk-exit-this-page__indicator-light';
      this.$indicatorContainer.appendChild($indicator);
    }
    this.$button.appendChild(this.$indicatorContainer);
  }
  updateIndicator() {
    if (this.keypressCounter > 0) {
      this.$indicatorContainer.classList.add('govuk-exit-this-page__indicator--visible');
    } else {
      this.$indicatorContainer.classList.remove('govuk-exit-this-page__indicator--visible');
    }
    const $indicators = this.$indicatorContainer.querySelectorAll('.govuk-exit-this-page__indicator-light');
    $indicators.forEach(($indicator, index) => {
      $indicator.classList.toggle('govuk-exit-this-page__indicator-light--on', index < this.keypressCounter);
    });
  }
  exitPage() {
    this.$updateSpan.textContent = '';
    document.body.classList.add('govuk-exit-this-page-hide-content');
    this.$overlay = document.createElement('div');
    this.$overlay.className = 'govuk-exit-this-page-overlay';
    this.$overlay.setAttribute('role', 'alert');
    document.body.appendChild(this.$overlay);
    this.$overlay.textContent = this.i18n.t('activated');
    window.location.href = this.$button.getAttribute('href');
  }
  handleClick(event) {
    event.preventDefault();
    this.exitPage();
  }
  handleKeypress(event) {
    if ((event.key === 'Shift' || event.keyCode === 16 || event.which === 16) && !this.lastKeyWasModified) {
      this.keypressCounter += 1;
      this.updateIndicator();
      if (this.timeoutMessageId !== null) {
        window.clearTimeout(this.timeoutMessageId);
        this.timeoutMessageId = null;
      }
      if (this.keypressCounter >= 3) {
        this.keypressCounter = 0;
        if (this.keypressTimeoutId !== null) {
          window.clearTimeout(this.keypressTimeoutId);
          this.keypressTimeoutId = null;
        }
        this.exitPage();
      } else {
        if (this.keypressCounter === 1) {
          this.$updateSpan.textContent = this.i18n.t('pressTwoMoreTimes');
        } else {
          this.$updateSpan.textContent = this.i18n.t('pressOneMoreTime');
        }
      }
      this.setKeypressTimer();
    } else if (this.keypressTimeoutId !== null) {
      this.resetKeypressTimer();
    }
    this.lastKeyWasModified = event.shiftKey;
  }
  setKeypressTimer() {
    window.clearTimeout(this.keypressTimeoutId);
    this.keypressTimeoutId = window.setTimeout(this.resetKeypressTimer.bind(this), this.timeoutTime);
  }
  resetKeypressTimer() {
    window.clearTimeout(this.keypressTimeoutId);
    this.keypressTimeoutId = null;
    this.keypressCounter = 0;
    this.$updateSpan.textContent = this.i18n.t('timedOut');
    this.timeoutMessageId = window.setTimeout(() => {
      this.$updateSpan.textContent = '';
    }, this.timeoutTime);
    this.updateIndicator();
  }
  resetPage() {
    document.body.classList.remove('govuk-exit-this-page-hide-content');
    if (this.$overlay) {
      this.$overlay.remove();
      this.$overlay = null;
    }
    this.$updateSpan.setAttribute('role', 'status');
    this.$updateSpan.textContent = '';
    this.updateIndicator();
    if (this.keypressTimeoutId) {
      window.clearTimeout(this.keypressTimeoutId);
    }
    if (this.timeoutMessageId) {
      window.clearTimeout(this.timeoutMessageId);
    }
  }
}

/**
 * Exit this Page config
 *
 * @see {@link ExitThisPage.defaults}
 * @typedef {object} ExitThisPageConfig
 * @property {ExitThisPageTranslations} [i18n=ExitThisPage.defaults.i18n] - Exit this page translations
 */

/**
 * Exit this Page translations
 *
 * @see {@link ExitThisPage.defaults.i18n}
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
ExitThisPage.moduleName = 'govuk-exit-this-page';
ExitThisPage.defaults = Object.freeze({
  i18n: {
    activated: 'Loading.',
    timedOut: 'Exit this page expired.',
    pressTwoMoreTimes: 'Shift, press 2 more times to exit.',
    pressOneMoreTime: 'Shift, press 1 more time to exit.'
  }
});

export { ExitThisPage };
//# sourceMappingURL=exit-this-page.mjs.map
