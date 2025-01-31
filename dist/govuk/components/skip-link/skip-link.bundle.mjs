function getFragmentFromUrl(url) {
  if (!url.includes('#')) {
    return undefined;
  }
  return url.split('#').pop();
}
function setFocus($element, options = {}) {
  var _options$onBeforeFocu;
  const isFocusable = $element.getAttribute('tabindex');
  if (!isFocusable) {
    $element.setAttribute('tabindex', '-1');
  }
  function onFocus() {
    $element.addEventListener('blur', onBlur, {
      once: true
    });
  }
  function onBlur() {
    var _options$onBlur;
    (_options$onBlur = options.onBlur) == null || _options$onBlur.call($element);
    if (!isFocusable) {
      $element.removeAttribute('tabindex');
    }
  }
  $element.addEventListener('focus', onFocus, {
    once: true
  });
  (_options$onBeforeFocu = options.onBeforeFocus) == null || _options$onBeforeFocu.call($element);
  $element.focus();
}
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
 * Skip link component
 *
 * @preserve
 * @augments GOVUKFrontendComponent<HTMLAnchorElement>
 */
class SkipLink extends GOVUKFrontendComponent {
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
    let url;
    try {
      url = new window.URL(this.$root.href);
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
//# sourceMappingURL=skip-link.bundle.mjs.map
