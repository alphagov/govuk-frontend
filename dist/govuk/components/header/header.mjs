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
   * @param {Element | null} $module - HTML element to use for header
   */
  constructor($module) {
    super();
    this.$module = void 0;
    this.$menuButton = void 0;
    this.$oneLoginMenuButton = void 0;
    this.$menu = void 0;
    this.$oneLoginMenu = void 0;
    this.menuIsOpen = false;
    this.oneLoginMenuIsOpen = false;
    this.mql = null;
    if (!$module) {
      throw new ElementError({
        componentName: 'Header',
        element: $module,
        identifier: 'Root element (`$module`)'
      });
    }
    this.$module = $module;
    const $menuButton = $module.querySelector('.govuk-js-header-toggle');
    const $oneLoginMenuButton = $module.querySelector('.govuk-js-one-login-toggle');
    if (!$menuButton && !$oneLoginMenuButton) {
      return this;
    }
    if ($menuButton) {
      const menuId = $menuButton.getAttribute('aria-controls');
      if (!menuId) {
        throw new ElementError({
          componentName: 'Header',
          identifier: 'Navigation button (`<button class="govuk-js-header-toggle">`) attribute (`aria-controls`)'
        });
      }
      const $menu = document.getElementById(menuId);
      if (!$menu) {
        throw new ElementError({
          componentName: 'Header',
          element: $menu,
          identifier: `Navigation (\`<ul id="${menuId}">\`)`
        });
      }
      this.$menu = $menu;
      this.$menuButton = $menuButton;
      this.$menuButton.addEventListener('click', () => this.handleMenuButtonClick());
    }
    if ($oneLoginMenuButton) {
      const menuId = $oneLoginMenuButton.getAttribute('aria-controls');
      if (!menuId) {
        throw new ElementError({
          componentName: 'Header',
          identifier: 'One Login menu button (`<button class="govuk-js-one-login-toggle">`) attribute (`aria-controls`)'
        });
      }
      const $oneLoginMenu = document.getElementById(menuId);
      if (!$oneLoginMenu) {
        throw new ElementError({
          componentName: 'Header',
          element: $oneLoginMenu,
          identifier: `Navigation (\`<ul id="${menuId}">\`)`
        });
      }
      this.$oneLoginMenu = $oneLoginMenu;
      this.$oneLoginMenuButton = $oneLoginMenuButton;
      this.$oneLoginMenuButton.addEventListener('click', () => this.handleOneLoginMenuButtonClick());
    }
    this.setupResponsiveChecks();
  }
  setupResponsiveChecks() {
    const breakpoint = getBreakpoint('tablet');
    if (!breakpoint.value) {
      throw new ElementError({
        componentName: 'Header',
        identifier: `CSS custom property (\`${breakpoint.property}\`) on pseudo-class \`:root\``
      });
    }
    this.mql = window.matchMedia(`(min-width: ${breakpoint.value})`);
    if ('addEventListener' in this.mql) {
      this.mql.addEventListener('change', () => {
        this.checkMode();
        this.checkOneLoginMode();
      });
    } else {
      this.mql.addListener(() => {
        this.checkMode();
        this.checkOneLoginMode();
      });
    }
    this.checkMode();
    this.checkOneLoginMode();
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
  checkOneLoginMode() {
    if (!this.mql || !this.$oneLoginMenu || !this.$oneLoginMenuButton) {
      return;
    }
    if (this.mql.matches) {
      this.$oneLoginMenu.removeAttribute('hidden');
      this.$oneLoginMenuButton.setAttribute('hidden', '');
    } else {
      this.$oneLoginMenuButton.removeAttribute('hidden');
      this.$oneLoginMenuButton.setAttribute('aria-expanded', this.oneLoginMenuIsOpen.toString());
      if (this.oneLoginMenuIsOpen) {
        this.$oneLoginMenu.removeAttribute('hidden');
      } else {
        this.$oneLoginMenu.setAttribute('hidden', '');
      }
    }
  }
  handleMenuButtonClick() {
    this.menuIsOpen = !this.menuIsOpen;
    this.checkMode();
  }
  handleOneLoginMenuButtonClick() {
    this.oneLoginMenuIsOpen = !this.oneLoginMenuIsOpen;
    this.checkOneLoginMode();
  }
}
Header.moduleName = 'govuk-header';

export { Header };
//# sourceMappingURL=header.mjs.map
