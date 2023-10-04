import { ElementError } from '../../errors/index.mjs';
import { GOVUKFrontendComponent } from '../../govuk-frontend-component.mjs';

/**
 * Skip link component
 *
 * @preserve
 */
class SkipLink extends GOVUKFrontendComponent {
  /**
   * @param {Element} $module - HTML element to use for skip link
   * @throws {ElementError} when $module is not set or the wrong type
   * @throws {ElementError} when $module.hash does not contain a hash
   * @throws {ElementError} when the linked element is missing or the wrong type
   */
  constructor($module) {
    super();
    this.$module = void 0;
    this.$linkedElement = void 0;
    this.linkedElementListener = false;
    if (!($module instanceof HTMLAnchorElement)) {
      throw new ElementError($module, {
        componentName: 'Skip link',
        identifier: '$module',
        expectedType: HTMLAnchorElement
      });
    }
    this.$module = $module;
    this.$linkedElement = this.getLinkedElement();
    this.$module.addEventListener('click', () => this.focusLinkedElement());
  }
  getLinkedElement() {
    const linkedElementId = this.getFragmentFromUrl(this.$module.hash);
    if (!linkedElementId) {
      throw new ElementError(this.$module, {
        componentName: 'Skip link',
        identifier: '$module.hash',
        expectedType: 'string'
      });
    }
    const $linkedElement = document.getElementById(linkedElementId);
    if (!($linkedElement instanceof HTMLElement)) {
      throw new ElementError($linkedElement, {
        componentName: 'Skip link',
        identifier: `$module.hash target #${linkedElementId}`
      });
    }
    return $linkedElement;
  }
  focusLinkedElement() {
    if (!this.$linkedElement.getAttribute('tabindex')) {
      this.$linkedElement.setAttribute('tabindex', '-1');
      this.$linkedElement.classList.add('govuk-skip-link-focused-element');
      if (!this.linkedElementListener) {
        this.$linkedElement.addEventListener('blur', () => this.removeFocusProperties());
        this.linkedElementListener = true;
      }
    }
    this.$linkedElement.focus();
  }
  removeFocusProperties() {
    this.$linkedElement.removeAttribute('tabindex');
    this.$linkedElement.classList.remove('govuk-skip-link-focused-element');
  }
  getFragmentFromUrl(url) {
    if (url.indexOf('#') === -1) {
      return undefined;
    }
    return url.split('#').pop();
  }
}
SkipLink.moduleName = 'govuk-skip-link';

export { SkipLink };
//# sourceMappingURL=skip-link.mjs.map
