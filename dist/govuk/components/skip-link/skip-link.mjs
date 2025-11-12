import { setFocus } from '../../common/index.mjs';
import { Component } from '../../component.mjs';
import { ElementError } from '../../errors/index.mjs';

/**
 * Skip link component
 *
 * @preserve
 * @augments Component<HTMLAnchorElement>
 */
class SkipLink extends Component {
  /**
   * @param {Element | null} $root - HTML element to use for skip link
   * @throws {ElementError} when $root is not set or the wrong type
   * @throws {ElementError} when $root.hash does not contain a hash
   * @throws {ElementError} when the linked element is missing or the wrong type
   */
  constructor($root) {
    var _this$$root$getAttrib;
    super($root);
    const hash = this.$root.hash;
    const href = (_this$$root$getAttrib = this.$root.getAttribute('href')) != null ? _this$$root$getAttrib : '';
    if (this.$root.origin !== window.location.origin || this.$root.pathname !== window.location.pathname) {
      return;
    }
    const linkedElementId = hash.replace('#', '');
    if (!linkedElementId) {
      throw new ElementError(`Skip link: Target link (\`href="${href}"\`) has no hash fragment`);
    }
    const $linkedElement = document.getElementById(linkedElementId);
    if (!$linkedElement) {
      throw new ElementError({
        component: SkipLink,
        element: $linkedElement,
        identifier: `Target content (\`id="${linkedElementId}"\`)`
      });
    }
    this.$root.addEventListener('click', () => setFocus($linkedElement, {
      onBeforeFocus() {
        $linkedElement.classList.add('govuk-skip-link-focused-element');
      },
      onBlur() {
        $linkedElement.classList.remove('govuk-skip-link-focused-element');
      }
    }));
  }
}
SkipLink.elementType = HTMLAnchorElement;
SkipLink.moduleName = 'govuk-skip-link';

export { SkipLink };
//# sourceMappingURL=skip-link.mjs.map
