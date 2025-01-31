function isInitialised($root, moduleName) {
  return $root instanceof HTMLElement && $root.hasAttribute(`data-${moduleName}-init`);
}

/**
 * Checks if GOV.UK Frontend is supported on this page
 *
 * Some browsers will load and run our JavaScript but GOV.UK Frontend
 * won't be supported.
 *
 * @param {HTMLElement | null} [$scope] - (internal) `<body>` HTML element checked for browser support
 * @returns {boolean} Whether GOV.UK Frontend is supported on this page
 */
function isSupported($scope = document.body) {
  if (!$scope) {
    return false;
  }
  return $scope.classList.contains('govuk-frontend-supported');
}
function formatErrorMessage(Component, message) {
  return `${Component.moduleName}: ${message}`;
}
/**
 * @typedef ComponentWithModuleName
 * @property {string} moduleName - Name of the component
 */

class GOVUKFrontendError extends Error {
  constructor(...args) {
    super(...args);
    this.name = 'GOVUKFrontendError';
  }
}
class SupportError extends GOVUKFrontendError {
  /**
   * Checks if GOV.UK Frontend is supported on this page
   *
   * @param {HTMLElement | null} [$scope] - HTML element `<body>` checked for browser support
   */
  constructor($scope = document.body) {
    const supportMessage = 'noModule' in HTMLScriptElement.prototype ? 'GOV.UK Frontend initialised without `<body class="govuk-frontend-supported">` from template `<script>` snippet' : 'GOV.UK Frontend is not supported in this browser';
    super($scope ? supportMessage : 'GOV.UK Frontend initialised without `<script type="module">`');
    this.name = 'SupportError';
  }
}
class ElementError extends GOVUKFrontendError {
  constructor(messageOrOptions) {
    let message = typeof messageOrOptions === 'string' ? messageOrOptions : '';
    if (typeof messageOrOptions === 'object') {
      const {
        component,
        identifier,
        element,
        expectedType
      } = messageOrOptions;
      message = identifier;
      message += element ? ` is not of type ${expectedType != null ? expectedType : 'HTMLElement'}` : ' not found';
      message = formatErrorMessage(component, message);
    }
    super(message);
    this.name = 'ElementError';
  }
}
class InitError extends GOVUKFrontendError {
  constructor(componentOrMessage) {
    const message = typeof componentOrMessage === 'string' ? componentOrMessage : formatErrorMessage(componentOrMessage, `Root element (\`$root\`) already initialised`);
    super(message);
    this.name = 'InitError';
  }
}
/**
 * @typedef {import('../common/index.mjs').ComponentWithModuleName} ComponentWithModuleName
 */

class GOVUKFrontendComponent {
  /**
   * Returns the root element of the component
   *
   * @protected
   * @returns {RootElementType} - the root element of component
   */
  get $root() {
    return this._$root;
  }
  constructor($root) {
    this._$root = void 0;
    const childConstructor = this.constructor;
    if (typeof childConstructor.moduleName !== 'string') {
      throw new InitError(`\`moduleName\` not defined in component`);
    }
    if (!($root instanceof childConstructor.elementType)) {
      throw new ElementError({
        element: $root,
        component: childConstructor,
        identifier: 'Root element (`$root`)',
        expectedType: childConstructor.elementType.name
      });
    } else {
      this._$root = $root;
    }
    childConstructor.checkSupport();
    this.checkInitialised();
    const moduleName = childConstructor.moduleName;
    this.$root.setAttribute(`data-${moduleName}-init`, '');
  }
  checkInitialised() {
    const constructor = this.constructor;
    const moduleName = constructor.moduleName;
    if (moduleName && isInitialised(this.$root, moduleName)) {
      throw new InitError(constructor);
    }
  }
  static checkSupport() {
    if (!isSupported()) {
      throw new SupportError();
    }
  }
}

/**
 * @typedef ChildClass
 * @property {string} moduleName - The module name that'll be looked for in the DOM when initialising the component
 */

/**
 * @typedef {typeof GOVUKFrontendComponent & ChildClass} ChildClassConstructor
 */
GOVUKFrontendComponent.elementType = HTMLElement;

/**
 * Checkboxes component
 *
 * @preserve
 */
class Checkboxes extends GOVUKFrontendComponent {
  /**
   * Checkboxes can be associated with a 'conditionally revealed' content block
   * – for example, a checkbox for 'Phone' could reveal an additional form field
   * for the user to enter their phone number.
   *
   * These associations are made using a `data-aria-controls` attribute, which
   * is promoted to an aria-controls attribute during initialisation.
   *
   * We also need to restore the state of any conditional reveals on the page
   * (for example if the user has navigated back), and set up event handlers to
   * keep the reveal in sync with the checkbox state.
   *
   * @param {Element | null} $root - HTML element to use for checkboxes
   */
  constructor($root) {
    super($root);
    this.$inputs = void 0;
    const $inputs = this.$root.querySelectorAll('input[type="checkbox"]');
    if (!$inputs.length) {
      throw new ElementError({
        component: Checkboxes,
        identifier: 'Form inputs (`<input type="checkbox">`)'
      });
    }
    this.$inputs = $inputs;
    this.$inputs.forEach($input => {
      const targetId = $input.getAttribute('data-aria-controls');
      if (!targetId) {
        return;
      }
      if (!document.getElementById(targetId)) {
        throw new ElementError({
          component: Checkboxes,
          identifier: `Conditional reveal (\`id="${targetId}"\`)`
        });
      }
      $input.setAttribute('aria-controls', targetId);
      $input.removeAttribute('data-aria-controls');
    });
    window.addEventListener('pageshow', () => this.syncAllConditionalReveals());
    this.syncAllConditionalReveals();
    this.$root.addEventListener('click', event => this.handleClick(event));
  }
  syncAllConditionalReveals() {
    this.$inputs.forEach($input => this.syncConditionalRevealWithInputState($input));
  }
  syncConditionalRevealWithInputState($input) {
    const targetId = $input.getAttribute('aria-controls');
    if (!targetId) {
      return;
    }
    const $target = document.getElementById(targetId);
    if ($target != null && $target.classList.contains('govuk-checkboxes__conditional')) {
      const inputIsChecked = $input.checked;
      $input.setAttribute('aria-expanded', inputIsChecked.toString());
      $target.classList.toggle('govuk-checkboxes__conditional--hidden', !inputIsChecked);
    }
  }
  unCheckAllInputsExcept($input) {
    const allInputsWithSameName = document.querySelectorAll(`input[type="checkbox"][name="${$input.name}"]`);
    allInputsWithSameName.forEach($inputWithSameName => {
      const hasSameFormOwner = $input.form === $inputWithSameName.form;
      if (hasSameFormOwner && $inputWithSameName !== $input) {
        $inputWithSameName.checked = false;
        this.syncConditionalRevealWithInputState($inputWithSameName);
      }
    });
  }
  unCheckExclusiveInputs($input) {
    const allInputsWithSameNameAndExclusiveBehaviour = document.querySelectorAll(`input[data-behaviour="exclusive"][type="checkbox"][name="${$input.name}"]`);
    allInputsWithSameNameAndExclusiveBehaviour.forEach($exclusiveInput => {
      const hasSameFormOwner = $input.form === $exclusiveInput.form;
      if (hasSameFormOwner) {
        $exclusiveInput.checked = false;
        this.syncConditionalRevealWithInputState($exclusiveInput);
      }
    });
  }
  handleClick(event) {
    const $clickedInput = event.target;
    if (!($clickedInput instanceof HTMLInputElement) || $clickedInput.type !== 'checkbox') {
      return;
    }
    const hasAriaControls = $clickedInput.getAttribute('aria-controls');
    if (hasAriaControls) {
      this.syncConditionalRevealWithInputState($clickedInput);
    }
    if (!$clickedInput.checked) {
      return;
    }
    const hasBehaviourExclusive = $clickedInput.getAttribute('data-behaviour') === 'exclusive';
    if (hasBehaviourExclusive) {
      this.unCheckAllInputsExcept($clickedInput);
    } else {
      this.unCheckExclusiveInputs($clickedInput);
    }
  }
}
Checkboxes.moduleName = 'govuk-checkboxes';

export { Checkboxes };
//# sourceMappingURL=checkboxes.bundle.mjs.map
