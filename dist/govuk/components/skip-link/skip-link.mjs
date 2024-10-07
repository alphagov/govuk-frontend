import { getFragmentFromUrl, setFocus } from '../../common/index.mjs';
import { ElementError } from '../../errors/index.mjs';
import { GOVUKFrontendComponent } from '../../govuk-frontend-component.mjs';

/**
 * Skip link component
 *
 * @preserve
 */
class SkipLink extends GOVUKFrontendComponent {
  /**
   * @param {Element | null} $module - HTML element to use for skip link
   * @throws {ElementError} when $module is not set or the wrong type
   * @throws {ElementError} when $module.hash does not contain a hash
   * @throws {ElementError} when the linked element is missing or the wrong type
   */
  constructor($module) {
    var _this$$module$getAttr;
    super();
    this.$module = void 0;
    if (!($module instanceof HTMLAnchorElement)) {
      throw new ElementError({
        componentName: 'Skip link',
        element: $module,
        expectedType: 'HTMLAnchorElement',
        identifier: 'Root element (`$module`)'
      });
    }
    this.$module = $module;
    const hash = this.$module.hash;
    const href = (_this$$module$getAttr = this.$module.getAttribute('href')) != null ? _this$$module$getAttr : '';
    let url;
    try {
      url = new window.URL(this.$module.href);
    } catch (error) {
      throw new ElementError(`Skip link: Target link (\`href="${href}"\`) is invalid`);
    }
    if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) {
      return;
    }
    const linkedElementId = getFragmentFromUrl(hash);
    if (!linkedElementId) {
      throw new ElementError(`Skip link: Target link (\`href="${href}"\`) has no hash fragment`);
    }
    const $linkedElement = document.getElementById(linkedElementId);
    if (!$linkedElement) {
      throw new ElementError({
        componentName: 'Skip link',
        element: $linkedElement,
        identifier: `Target content (\`id="${linkedElementId}"\`)`
      });
    }
    this.$module.addEventListener('click', () => setFocus($linkedElement, {
      onBeforeFocus() {
        $linkedElement.classList.add('govuk-skip-link-focused-element');
      },
      onBlur() {
        $linkedElement.classList.remove('govuk-skip-link-focused-element');
      }
    }));
  }
}
SkipLink.moduleName = 'govuk-skip-link';

export { SkipLink };
//# sourceMappingURL=skip-link.mjs.map
