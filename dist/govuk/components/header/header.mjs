import { getBreakpoint } from '../../common/index.mjs';
import { ElementError } from '../../errors/index.mjs';
import { GOVUKFrontendComponent } from '../../govuk-frontend-component.mjs';

/**
 * Header component
 *
 * @preserve
 */
class Header extends GOVUKFrontendComponent {
  /**
   * Apply a matchMedia for desktop which will trigger a state sync if the
   * browser viewport moves between states.
   *
   * @param {Element | null} $root - HTML element to use for header
   */
  constructor($root) {
    super($root);
    this.$menuButton = void 0;
    this.$menu = void 0;
    this.menuIsOpen = false;
    this.mql = null;
    const $menuButton = this.$root.querySelector('.govuk-js-header-toggle');
    if (!$menuButton) {
      return this;
    }
    const menuId = $menuButton.getAttribute('aria-controls');
    if (!menuId) {
      throw new ElementError({
        component: Header,
        identifier: 'Navigation button (`<button class="govuk-js-header-toggle">`) attribute (`aria-controls`)'
      });
    }
    const $menu = document.getElementById(menuId);
    if (!$menu) {
      throw new ElementError({
        component: Header,
        element: $menu,
        identifier: `Navigation (\`<ul id="${menuId}">\`)`
      });
    }
    this.$menu = $menu;
    this.$menuButton = $menuButton;
    this.setupResponsiveChecks();
    this.$menuButton.addEventListener('click', () => this.handleMenuButtonClick());
  }
  setupResponsiveChecks() {
    const breakpoint = getBreakpoint('desktop');
    if (!breakpoint.value) {
      throw new ElementError({
        component: Header,
        identifier: `CSS custom property (\`${breakpoint.property}\`) on pseudo-class \`:root\``
      });
    }
    this.mql = window.matchMedia(`(min-width: ${breakpoint.value})`);
    if ('addEventListener' in this.mql) {
      this.mql.addEventListener('change', () => this.checkMode());
    } else {
      this.mql.addListener(() => this.checkMode());
    }
    this.checkMode();
  }
  checkMode() {
    if (!this.mql || !this.$menu || !this.$menuButton) {
      return;
    }
    if (this.mql.matches) {
      this.$menu.removeAttribute('hidden');
      this.$menuButton.setAttribute('hidden', '');
    } else {
      this.$menuButton.removeAttribute('hidden');
      this.$menuButton.setAttribute('aria-expanded', this.menuIsOpen.toString());
      if (this.menuIsOpen) {
        this.$menu.removeAttribute('hidden');
      } else {
        this.$menu.setAttribute('hidden', '');
      }
    }
  }
  handleMenuButtonClick() {
    this.menuIsOpen = !this.menuIsOpen;
    this.checkMode();
  }
}
Header.moduleName = 'govuk-header';

export { Header };
//# sourceMappingURL=header.mjs.map
