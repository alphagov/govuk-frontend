import { getBreakpoint } from '../../common/index.mjs';
import { ElementError } from '../../errors/index.mjs';
import { GOVUKFrontendComponent } from '../../govuk-frontend-component.mjs';

/**
 * Service Navigation component
 *
 * @preserve
 */
class ServiceNavigation extends GOVUKFrontendComponent {
  /**
   * @param {Element | null} $module - HTML element to use for header
   */
  constructor($module) {
    super();
    this.$module = void 0;
    this.$menuButton = void 0;
    this.$menu = void 0;
    this.menuIsOpen = false;
    this.mql = null;
    if (!$module) {
      throw new ElementError({
        componentName: 'Service Navigation',
        element: $module,
        identifier: 'Root element (`$module`)'
      });
    }
    this.$module = $module;
    const $menuButton = $module.querySelector('.govuk-js-service-navigation-toggle');
    if (!$menuButton) {
      return this;
    }
    const menuId = $menuButton.getAttribute('aria-controls');
    if (!menuId) {
      throw new ElementError({
        componentName: 'Service Navigation',
        identifier: 'Navigation button (`<button class="govuk-js-service-navigation-toggle">`) attribute (`aria-controls`)'
      });
    }
    const $menu = document.getElementById(menuId);
    if (!$menu) {
      throw new ElementError({
        componentName: 'Service Navigation',
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
    const breakpoint = getBreakpoint('tablet');
    if (!breakpoint.value) {
      throw new ElementError({
        componentName: 'Service Navigation',
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
ServiceNavigation.moduleName = 'govuk-service-navigation';

export { ServiceNavigation };
//# sourceMappingURL=service-navigation.mjs.map
