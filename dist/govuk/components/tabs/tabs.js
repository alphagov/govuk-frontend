(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('GOVUKFrontend.Tabs', factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.GOVUKFrontend = global.GOVUKFrontend || {}, global.GOVUKFrontend.Tabs = factory()));
})(this, (function () { 'use strict';

    (function (undefined$1) {

        // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/master/packages/polyfill-library/polyfills/DOMTokenList/detect.js
        var detect = (
          'DOMTokenList' in this && (function (x) {
            return 'classList' in x ? !x.classList.toggle('x', false) && !x.className : true;
          })(document.createElement('x'))
        );

        if (detect) return

        // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-service/master/packages/polyfill-library/polyfills/DOMTokenList/polyfill.js
        (function (global) {
          var nativeImpl = "DOMTokenList" in global && global.DOMTokenList;

          if (
              !nativeImpl ||
              (
                !!document.createElementNS &&
                !!document.createElementNS('http://www.w3.org/2000/svg', 'svg') &&
                !(document.createElementNS("http://www.w3.org/2000/svg", "svg").classList instanceof DOMTokenList)
              )
            ) {
            global.DOMTokenList = (function() { // eslint-disable-line no-unused-vars
              var dpSupport = true;
              var defineGetter = function (object, name, fn, configurable) {
                if (Object.defineProperty)
                  Object.defineProperty(object, name, {
                    configurable: false === dpSupport ? true : !!configurable,
                    get: fn
                  });

                else object.__defineGetter__(name, fn);
              };

              /** Ensure the browser allows Object.defineProperty to be used on native JavaScript objects. */
              try {
                defineGetter({}, "support");
              }
              catch (e) {
                dpSupport = false;
              }


              var _DOMTokenList = function (el, prop) {
                var that = this;
                var tokens = [];
                var tokenMap = {};
                var length = 0;
                var maxLength = 0;
                var addIndexGetter = function (i) {
                  defineGetter(that, i, function () {
                    preop();
                    return tokens[i];
                  }, false);

                };
                var reindex = function () {

                  /** Define getter functions for array-like access to the tokenList's contents. */
                  if (length >= maxLength)
                    for (; maxLength < length; ++maxLength) {
                      addIndexGetter(maxLength);
                    }
                };

                /** Helper function called at the start of each class method. Internal use only. */
                var preop = function () {
                  var error;
                  var i;
                  var args = arguments;
                  var rSpace = /\s+/;

                  /** Validate the token/s passed to an instance method, if any. */
                  if (args.length)
                    for (i = 0; i < args.length; ++i)
                      if (rSpace.test(args[i])) {
                        error = new SyntaxError('String "' + args[i] + '" ' + "contains" + ' an invalid character');
                        // @ts-expect-error Ignore unknown 'code' property on SyntaxError
                        error.code = 5;
                        error.name = "InvalidCharacterError";
                        throw error;
                      }


                  /** Split the new value apart by whitespace*/
                  if (typeof el[prop] === "object") {
                    tokens = ("" + el[prop].baseVal).replace(/^\s+|\s+$/g, "").split(rSpace);
                  } else {
                    tokens = ("" + el[prop]).replace(/^\s+|\s+$/g, "").split(rSpace);
                  }

                  /** Avoid treating blank strings as single-item token lists */
                  if ("" === tokens[0]) tokens = [];

                  /** Repopulate the internal token lists */
                  tokenMap = {};
                  for (i = 0; i < tokens.length; ++i)
                    tokenMap[tokens[i]] = true;
                  length = tokens.length;
                  reindex();
                };

                /** Populate our internal token list if the targeted attribute of the subject element isn't empty. */
                preop();

                /** Return the number of tokens in the underlying string. Read-only. */
                defineGetter(that, "length", function () {
                  preop();
                  return length;
                });

                /** Override the default toString/toLocaleString methods to return a space-delimited list of tokens when typecast. */
                that.toLocaleString =
                  that.toString = function () {
                    preop();
                    return tokens.join(" ");
                  };

                that.item = function (idx) {
                  preop();
                  return tokens[idx];
                };

                that.contains = function (token) {
                  preop();
                  return !!tokenMap[token];
                };

                that.add = function () {
                  // @ts-expect-error Ignore mismatch between arguments types
                  preop.apply(that, args = arguments);

                  for (var args, token, i = 0, l = args.length; i < l; ++i) {
                    token = args[i];
                    if (!tokenMap[token]) {
                      tokens.push(token);
                      tokenMap[token] = true;
                    }
                  }

                  /** Update the targeted attribute of the attached element if the token list's changed. */
                  if (length !== tokens.length) {
                    length = tokens.length >>> 0;
                    if (typeof el[prop] === "object") {
                      el[prop].baseVal = tokens.join(" ");
                    } else {
                      el[prop] = tokens.join(" ");
                    }
                    reindex();
                  }
                };

                that.remove = function () {
                  // @ts-expect-error Ignore mismatch between arguments types
                  preop.apply(that, args = arguments);

                  /** Build a hash of token names to compare against when recollecting our token list. */
                  for (var args, ignore = {}, i = 0, t = []; i < args.length; ++i) {
                    ignore[args[i]] = true;
                    delete tokenMap[args[i]];
                  }

                  /** Run through our tokens list and reassign only those that aren't defined in the hash declared above. */
                  for (i = 0; i < tokens.length; ++i)
                    if (!ignore[tokens[i]]) t.push(tokens[i]);

                  tokens = t;
                  length = t.length >>> 0;

                  /** Update the targeted attribute of the attached element. */
                  if (typeof el[prop] === "object") {
                    el[prop].baseVal = tokens.join(" ");
                  } else {
                    el[prop] = tokens.join(" ");
                  }
                  reindex();
                };

                that.toggle = function (token, force) {
                  preop.apply(that, [token]);

                  /** Token state's being forced. */
                  if (undefined$1 !== force) {
                    if (force) {
                      that.add(token);
                      return true;
                    } else {
                      that.remove(token);
                      return false;
                    }
                  }

                  /** Token already exists in tokenList. Remove it, and return FALSE. */
                  if (tokenMap[token]) {
                    that.remove(token);
                    return false;
                  }

                  /** Otherwise, add the token and return TRUE. */
                  that.add(token);
                  return true;
                };

                return that;
              };

              return _DOMTokenList;
            }());
          }

          // Add second argument to native DOMTokenList.toggle() if necessary
          (function () {
            var e = document.createElement('span');
            if (!('classList' in e)) return;
            e.classList.toggle('x', false);
            if (!e.classList.contains('x')) return;
            e.classList.constructor.prototype.toggle = function toggle(token /*, force*/) {
              var force = arguments[1];
              if (force === undefined$1) {
                var add = !this.contains(token);
                this[add ? 'add' : 'remove'](token);
                return add;
              }
              force = !!force;
              this[force ? 'add' : 'remove'](token);
              return force;
            };
          }());

          // Add multiple arguments to native DOMTokenList.add() if necessary
          (function () {
            var e = document.createElement('span');
            if (!('classList' in e)) return;
            e.classList.add('a', 'b');
            if (e.classList.contains('b')) return;
            var native = e.classList.constructor.prototype.add;
            e.classList.constructor.prototype.add = function () {
              var args = arguments;
              var l = arguments.length;
              for (var i = 0; i < l; i++) {
                native.call(this, args[i]);
              }
            };
          }());

          // Add multiple arguments to native DOMTokenList.remove() if necessary
          (function () {
            var e = document.createElement('span');
            if (!('classList' in e)) return;
            e.classList.add('a');
            e.classList.add('b');
            e.classList.remove('a', 'b');
            if (!e.classList.contains('b')) return;
            var native = e.classList.constructor.prototype.remove;
            e.classList.constructor.prototype.remove = function () {
              var args = arguments;
              var l = arguments.length;
              for (var i = 0; i < l; i++) {
                native.call(this, args[i]);
              }
            };
          }());

        }(this));

    }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

    (function(undefined$1) {

        // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/8717a9e04ac7aff99b4980fbedead98036b0929a/packages/polyfill-library/polyfills/Element/prototype/classList/detect.js
        var detect = (
          'document' in this && "classList" in document.documentElement && 'Element' in this && 'classList' in Element.prototype && (function () {
            var e = document.createElement('span');
            e.classList.add('a', 'b');
            return e.classList.contains('b');
          }())
        );

        if (detect) return

        // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Element.prototype.classList&flags=always
        (function (global) {
          var dpSupport = true;
          var defineGetter = function (object, name, fn, configurable) {
            if (Object.defineProperty)
              Object.defineProperty(object, name, {
                configurable: false === dpSupport ? true : !!configurable,
                get: fn
              });

            else object.__defineGetter__(name, fn);
          };
          /** Ensure the browser allows Object.defineProperty to be used on native JavaScript objects. */
          try {
            defineGetter({}, "support");
          }
          catch (e) {
            dpSupport = false;
          }
          /** Polyfills a property with a DOMTokenList */
          var addProp = function (o, name, attr) {

            defineGetter(o.prototype, name, function () {
              var tokenList;

              var THIS = this,

              /** Prevent this from firing twice for some reason. What the hell, IE. */
              gibberishProperty = "__defineGetter__" + "DEFINE_PROPERTY" + name;
              if(THIS[gibberishProperty]) return tokenList;
              THIS[gibberishProperty] = true;

              /**
               * IE8 can't define properties on native JavaScript objects, so we'll use a dumb hack instead.
               *
               * What this is doing is creating a dummy element ("reflection") inside a detached phantom node ("mirror")
               * that serves as the target of Object.defineProperty instead. While we could simply use the subject HTML
               * element instead, this would conflict with element types which use indexed properties (such as forms and
               * select lists).
               */
              if (false === dpSupport) {

                var visage;
                // @ts-expect-error Ignore unknown 'mirror' property on function
                var mirror = addProp.mirror || document.createElement("div");
                var reflections = mirror.childNodes;
                var l = reflections.length;

                for (var i = 0; i < l; ++i)
                  if (reflections[i]._R === THIS) {
                    visage = reflections[i];
                    break;
                  }

                /** Couldn't find an element's reflection inside the mirror. Materialise one. */
                visage || (visage = mirror.appendChild(document.createElement("div")));

                // @ts-expect-error Ignore 'Expected 1 arguments, but got 3'
                tokenList = DOMTokenList.call(visage, THIS, attr);
              // @ts-expect-error Ignore 'Expected 0 arguments, but got 2'
              } else tokenList = new DOMTokenList(THIS, attr);

              defineGetter(THIS, name, function () {
                return tokenList;
              });
              delete THIS[gibberishProperty];

              return tokenList;
            }, true);
          };

          addProp(global.Element, "classList", "className");
          addProp(global.HTMLElement, "classList", "className");
          addProp(global.HTMLLinkElement, "relList", "rel");
          addProp(global.HTMLAnchorElement, "relList", "rel");
          addProp(global.HTMLAreaElement, "relList", "rel");
        }(this));

    }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

    /**
     * Tabs component
     *
     * @class
     * @param {Element} $module - HTML element to use for tabs
     */
    function Tabs ($module) {
      if (!($module instanceof HTMLElement)) {
        return this
      }

      /** @satisfies {NodeListOf<HTMLAnchorElement>} */
      var $tabs = $module.querySelectorAll('a.govuk-tabs__tab');
      if (!$tabs.length) {
        return this
      }

      /** @deprecated Will be made private in v5.0 */
      this.$module = $module;

      /** @deprecated Will be made private in v5.0 */
      this.$tabs = $tabs;

      /** @deprecated Will be made private in v5.0 */
      this.keys = { left: 37, right: 39, up: 38, down: 40 };

      /** @deprecated Will be made private in v5.0 */
      this.jsHiddenClass = 'govuk-tabs__panel--hidden';

      // Save bounded functions to use when removing event listeners during teardown

      /** @deprecated Will be made private in v5.0 */
      this.boundTabClick = this.onTabClick.bind(this);

      /** @deprecated Will be made private in v5.0 */
      this.boundTabKeydown = this.onTabKeydown.bind(this);

      /** @deprecated Will be made private in v5.0 */
      this.boundOnHashChange = this.onHashChange.bind(this);

      /** @deprecated Will be made private in v5.0 */
      this.changingHash = false;
    }

    /**
     * Initialise component
     */
    Tabs.prototype.init = function () {
      // Check that required elements are present
      if (!this.$module || !this.$tabs) {
        return
      }

      if (typeof window.matchMedia === 'function') {
        this.setupResponsiveChecks();
      } else {
        this.setup();
      }
    };

    /**
     * Setup viewport resize check
     *
     * @deprecated Will be made private in v5.0
     */
    Tabs.prototype.setupResponsiveChecks = function () {
      /** @deprecated Will be made private in v5.0 */
      this.mql = window.matchMedia('(min-width: 40.0625em)');
      this.mql.addListener(this.checkMode.bind(this));
      this.checkMode();
    };

    /**
     * Setup or teardown handler for viewport resize check
     *
     * @deprecated Will be made private in v5.0
     */
    Tabs.prototype.checkMode = function () {
      if (this.mql.matches) {
        this.setup();
      } else {
        this.teardown();
      }
    };

    /**
     * Setup tab component
     *
     * @deprecated Will be made private in v5.0
     */
    Tabs.prototype.setup = function () {
      var $component = this;
      var $module = this.$module;
      var $tabs = this.$tabs;
      var $tabList = $module.querySelector('.govuk-tabs__list');
      var $tabListItems = $module.querySelectorAll('.govuk-tabs__list-item');

      if (!$tabs || !$tabList || !$tabListItems) {
        return
      }

      $tabList.setAttribute('role', 'tablist');

      $tabListItems.forEach(function ($item) {
        $item.setAttribute('role', 'presentation');
      });

      $tabs.forEach(function ($tab) {
        // Set HTML attributes
        $component.setAttributes($tab);

        // Handle events
        $tab.addEventListener('click', $component.boundTabClick, true);
        $tab.addEventListener('keydown', $component.boundTabKeydown, true);

        // Remove old active panels
        $component.hideTab($tab);
      });

      // Show either the active tab according to the URL's hash or the first tab
      var $activeTab = this.getTab(window.location.hash) || this.$tabs[0];
      if (!$activeTab) {
        return
      }

      this.showTab($activeTab);

      // Handle hashchange events
      window.addEventListener('hashchange', this.boundOnHashChange, true);
    };

    /**
     * Teardown tab component
     *
     * @deprecated Will be made private in v5.0
     */
    Tabs.prototype.teardown = function () {
      var $component = this;
      var $module = this.$module;
      var $tabs = this.$tabs;
      var $tabList = $module.querySelector('.govuk-tabs__list');
      var $tabListItems = $module.querySelectorAll('a.govuk-tabs__list-item');

      if (!$tabs || !$tabList || !$tabListItems) {
        return
      }

      $tabList.removeAttribute('role');

      $tabListItems.forEach(function ($item) {
        $item.removeAttribute('role');
      });

      $tabs.forEach(function ($tab) {
        // Remove events
        $tab.removeEventListener('click', $component.boundTabClick, true);
        $tab.removeEventListener('keydown', $component.boundTabKeydown, true);

        // Unset HTML attributes
        $component.unsetAttributes($tab);
      });

      // Remove hashchange event handler
      window.removeEventListener('hashchange', this.boundOnHashChange, true);
    };

    /**
     * Handle hashchange event
     *
     * @deprecated Will be made private in v5.0
     * @returns {void | undefined} Returns void, or undefined when prevented
     */
    Tabs.prototype.onHashChange = function () {
      var hash = window.location.hash;
      var $tabWithHash = this.getTab(hash);
      if (!$tabWithHash) {
        return
      }

      // Prevent changing the hash
      if (this.changingHash) {
        this.changingHash = false;
        return
      }

      // Show either the active tab according to the URL's hash or the first tab
      var $previousTab = this.getCurrentTab();
      if (!$previousTab) {
        return
      }

      this.hideTab($previousTab);
      this.showTab($tabWithHash);
      $tabWithHash.focus();
    };

    /**
     * Hide panel for tab link
     *
     * @deprecated Will be made private in v5.0
     * @param {HTMLAnchorElement} $tab - Tab link
     */
    Tabs.prototype.hideTab = function ($tab) {
      this.unhighlightTab($tab);
      this.hidePanel($tab);
    };

    /**
     * Show panel for tab link
     *
     * @deprecated Will be made private in v5.0
     * @param {HTMLAnchorElement} $tab - Tab link
     */
    Tabs.prototype.showTab = function ($tab) {
      this.highlightTab($tab);
      this.showPanel($tab);
    };

    /**
     * Get tab link by hash
     *
     * @deprecated Will be made private in v5.0
     * @param {string} hash - Hash fragment including #
     * @returns {HTMLAnchorElement | null} Tab link
     */
    Tabs.prototype.getTab = function (hash) {
      return this.$module.querySelector('a.govuk-tabs__tab[href="' + hash + '"]')
    };

    /**
     * Set tab link and panel attributes
     *
     * @deprecated Will be made private in v5.0
     * @param {HTMLAnchorElement} $tab - Tab link
     */
    Tabs.prototype.setAttributes = function ($tab) {
      // set tab attributes
      var panelId = this.getHref($tab).slice(1);
      $tab.setAttribute('id', 'tab_' + panelId);
      $tab.setAttribute('role', 'tab');
      $tab.setAttribute('aria-controls', panelId);
      $tab.setAttribute('aria-selected', 'false');
      $tab.setAttribute('tabindex', '-1');

      // set panel attributes
      var $panel = this.getPanel($tab);
      if (!$panel) {
        return
      }

      $panel.setAttribute('role', 'tabpanel');
      $panel.setAttribute('aria-labelledby', $tab.id);
      $panel.classList.add(this.jsHiddenClass);
    };

    /**
     * Unset tab link and panel attributes
     *
     * @deprecated Will be made private in v5.0
     * @param {HTMLAnchorElement} $tab - Tab link
     */
    Tabs.prototype.unsetAttributes = function ($tab) {
      // unset tab attributes
      $tab.removeAttribute('id');
      $tab.removeAttribute('role');
      $tab.removeAttribute('aria-controls');
      $tab.removeAttribute('aria-selected');
      $tab.removeAttribute('tabindex');

      // unset panel attributes
      var $panel = this.getPanel($tab);
      if (!$panel) {
        return
      }

      $panel.removeAttribute('role');
      $panel.removeAttribute('aria-labelledby');
      $panel.classList.remove(this.jsHiddenClass);
    };

    /**
     * Handle tab link clicks
     *
     * @deprecated Will be made private in v5.0
     * @param {MouseEvent} event - Mouse click event
     * @returns {void} Returns void
     */
    Tabs.prototype.onTabClick = function (event) {
      var $currentTab = this.getCurrentTab();
      var $nextTab = event.currentTarget;

      if (!$currentTab || !($nextTab instanceof HTMLAnchorElement)) {
        return
      }

      event.preventDefault();

      this.hideTab($currentTab);
      this.showTab($nextTab);
      this.createHistoryEntry($nextTab);
    };

    /**
     * Update browser URL hash fragment for tab
     *
     * - Allows back/forward to navigate tabs
     * - Avoids page jump when hash changes
     *
     * @deprecated Will be made private in v5.0
     * @param {HTMLAnchorElement} $tab - Tab link
     */
    Tabs.prototype.createHistoryEntry = function ($tab) {
      var $panel = this.getPanel($tab);
      if (!$panel) {
        return
      }

      // Save and restore the id
      // so the page doesn't jump when a user clicks a tab (which changes the hash)
      var panelId = $panel.id;
      $panel.id = '';
      this.changingHash = true;
      window.location.hash = this.getHref($tab).slice(1);
      $panel.id = panelId;
    };

    /**
     * Handle tab keydown event
     *
     * - Press right/down arrow for next tab
     * - Press left/up arrow for previous tab
     *
     * @deprecated Will be made private in v5.0
     * @param {KeyboardEvent} event - Keydown event
     */
    Tabs.prototype.onTabKeydown = function (event) {
      switch (event.keyCode) {
        case this.keys.left:
        case this.keys.up:
          this.activatePreviousTab();
          event.preventDefault();
          break
        case this.keys.right:
        case this.keys.down:
          this.activateNextTab();
          event.preventDefault();
          break
      }
    };

    /**
     * Activate next tab
     *
     * @deprecated Will be made private in v5.0
     */
    Tabs.prototype.activateNextTab = function () {
      var $currentTab = this.getCurrentTab();
      if (!$currentTab || !$currentTab.parentElement) {
        return
      }

      var $nextTabListItem = $currentTab.parentElement.nextElementSibling;
      if (!$nextTabListItem) {
        return
      }

      /** @satisfies {HTMLAnchorElement} */
      var $nextTab = $nextTabListItem.querySelector('a.govuk-tabs__tab');
      if (!$nextTab) {
        return
      }

      this.hideTab($currentTab);
      this.showTab($nextTab);
      $nextTab.focus();
      this.createHistoryEntry($nextTab);
    };

    /**
     * Activate previous tab
     *
     * @deprecated Will be made private in v5.0
     */
    Tabs.prototype.activatePreviousTab = function () {
      var $currentTab = this.getCurrentTab();
      if (!$currentTab || !$currentTab.parentElement) {
        return
      }

      var $previousTabListItem = $currentTab.parentElement.previousElementSibling;
      if (!$previousTabListItem) {
        return
      }

      /** @satisfies {HTMLAnchorElement} */
      var $previousTab = $previousTabListItem.querySelector('a.govuk-tabs__tab');
      if (!$previousTab) {
        return
      }

      this.hideTab($currentTab);
      this.showTab($previousTab);
      $previousTab.focus();
      this.createHistoryEntry($previousTab);
    };

    /**
     * Get tab panel for tab link
     *
     * @deprecated Will be made private in v5.0
     * @param {HTMLAnchorElement} $tab - Tab link
     * @returns {Element | null} Tab panel
     */
    Tabs.prototype.getPanel = function ($tab) {
      return this.$module.querySelector(this.getHref($tab))
    };

    /**
     * Show tab panel for tab link
     *
     * @deprecated Will be made private in v5.0
     * @param {HTMLAnchorElement} $tab - Tab link
     */
    Tabs.prototype.showPanel = function ($tab) {
      var $panel = this.getPanel($tab);
      if (!$panel) {
        return
      }

      $panel.classList.remove(this.jsHiddenClass);
    };

    /**
     * Hide tab panel for tab link
     *
     * @deprecated Will be made private in v5.0
     * @param {HTMLAnchorElement} $tab - Tab link
     */
    Tabs.prototype.hidePanel = function ($tab) {
      var $panel = this.getPanel($tab);
      if (!$panel) {
        return
      }

      $panel.classList.add(this.jsHiddenClass);
    };

    /**
     * Unset 'selected' state for tab link
     *
     * @deprecated Will be made private in v5.0
     * @param {HTMLAnchorElement} $tab - Tab link
     */
    Tabs.prototype.unhighlightTab = function ($tab) {
      if (!$tab.parentElement) {
        return
      }

      $tab.setAttribute('aria-selected', 'false');
      $tab.parentElement.classList.remove('govuk-tabs__list-item--selected');
      $tab.setAttribute('tabindex', '-1');
    };

    /**
     * Set 'selected' state for tab link
     *
     * @deprecated Will be made private in v5.0
     * @param {HTMLAnchorElement} $tab - Tab link
     */
    Tabs.prototype.highlightTab = function ($tab) {
      if (!$tab.parentElement) {
        return
      }

      $tab.setAttribute('aria-selected', 'true');
      $tab.parentElement.classList.add('govuk-tabs__list-item--selected');
      $tab.setAttribute('tabindex', '0');
    };

    /**
     * Get current tab link
     *
     * @deprecated Will be made private in v5.0
     * @returns {HTMLAnchorElement | null} Tab link
     */
    Tabs.prototype.getCurrentTab = function () {
      return this.$module.querySelector('.govuk-tabs__list-item--selected a.govuk-tabs__tab')
    };

    /**
     * Get link hash fragment for href attribute
     *
     * this is because IE doesn't always return the actual value but a relative full path
     * should be a utility function most prob
     * {@link http://labs.thesedays.com/blog/2010/01/08/getting-the-href-value-with-jquery-in-ie/}
     *
     * @deprecated Will be made private in v5.0
     * @param {HTMLAnchorElement} $tab - Tab link
     * @returns {string} Hash fragment including #
     */
    Tabs.prototype.getHref = function ($tab) {
      var href = $tab.getAttribute('href');
      var hash = href.slice(href.indexOf('#'), href.length);
      return hash
    };

    return Tabs;

}));
//# sourceMappingURL=tabs.js.map
