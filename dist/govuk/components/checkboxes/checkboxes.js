(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('GOVUKFrontend.Checkboxes', factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.GOVUKFrontend = global.GOVUKFrontend || {}, global.GOVUKFrontend.Checkboxes = factory()));
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
     * Checkboxes component
     *
     * @class
     * @param {Element} $module - HTML element to use for checkboxes
     */
    function Checkboxes ($module) {
      if (!($module instanceof HTMLElement)) {
        return this
      }

      /** @satisfies {NodeListOf<HTMLInputElement>} */
      var $inputs = $module.querySelectorAll('input[type="checkbox"]');
      if (!$inputs.length) {
        return this
      }

      /** @deprecated Will be made private in v5.0 */
      this.$module = $module;

      /** @deprecated Will be made private in v5.0 */
      this.$inputs = $inputs;
    }

    /**
     * Initialise component
     *
     * Checkboxes can be associated with a 'conditionally revealed' content block –
     * for example, a checkbox for 'Phone' could reveal an additional form field for
     * the user to enter their phone number.
     *
     * These associations are made using a `data-aria-controls` attribute, which is
     * promoted to an aria-controls attribute during initialisation.
     *
     * We also need to restore the state of any conditional reveals on the page (for
     * example if the user has navigated back), and set up event handlers to keep
     * the reveal in sync with the checkbox state.
     */
    Checkboxes.prototype.init = function () {
      // Check that required elements are present
      if (!this.$module || !this.$inputs) {
        return
      }

      var $module = this.$module;
      var $inputs = this.$inputs;

      $inputs.forEach(function ($input) {
        var targetId = $input.getAttribute('data-aria-controls');

        // Skip checkboxes without data-aria-controls attributes, or where the
        // target element does not exist.
        if (!targetId || !document.getElementById(targetId)) {
          return
        }

        // Promote the data-aria-controls attribute to a aria-controls attribute
        // so that the relationship is exposed in the AOM
        $input.setAttribute('aria-controls', targetId);
        $input.removeAttribute('data-aria-controls');
      });

      // When the page is restored after navigating 'back' in some browsers the
      // state of form controls is not restored until *after* the DOMContentLoaded
      // event is fired, so we need to sync after the pageshow event in browsers
      // that support it.
      window.addEventListener(
        'onpageshow' in window ? 'pageshow' : 'DOMContentLoaded',
        this.syncAllConditionalReveals.bind(this)
      );

      // Although we've set up handlers to sync state on the pageshow or
      // DOMContentLoaded event, init could be called after those events have fired,
      // for example if they are added to the page dynamically, so sync now too.
      this.syncAllConditionalReveals();

      // Handle events
      $module.addEventListener('click', this.handleClick.bind(this));
    };

    /**
     * Sync the conditional reveal states for all checkboxes in this $module.
     *
     * @deprecated Will be made private in v5.0
     */
    Checkboxes.prototype.syncAllConditionalReveals = function () {
      this.$inputs.forEach(this.syncConditionalRevealWithInputState.bind(this));
    };

    /**
     * Sync conditional reveal with the input state
     *
     * Synchronise the visibility of the conditional reveal, and its accessible
     * state, with the input's checked state.
     *
     * @deprecated Will be made private in v5.0
     * @param {HTMLInputElement} $input - Checkbox input
     */
    Checkboxes.prototype.syncConditionalRevealWithInputState = function ($input) {
      var targetId = $input.getAttribute('aria-controls');
      if (!targetId) {
        return
      }

      var $target = document.getElementById(targetId);
      if ($target && $target.classList.contains('govuk-checkboxes__conditional')) {
        var inputIsChecked = $input.checked;

        $input.setAttribute('aria-expanded', inputIsChecked.toString());
        $target.classList.toggle('govuk-checkboxes__conditional--hidden', !inputIsChecked);
      }
    };

    /**
     * Uncheck other checkboxes
     *
     * Find any other checkbox inputs with the same name value, and uncheck them.
     * This is useful for when a “None of these" checkbox is checked.
     *
     * @deprecated Will be made private in v5.0
     * @param {HTMLInputElement} $input - Checkbox input
     */
    Checkboxes.prototype.unCheckAllInputsExcept = function ($input) {
      var $component = this;

      /** @satisfies {NodeListOf<HTMLInputElement>} */
      var allInputsWithSameName = document.querySelectorAll(
        'input[type="checkbox"][name="' + $input.name + '"]'
      );

      allInputsWithSameName.forEach(function ($inputWithSameName) {
        var hasSameFormOwner = ($input.form === $inputWithSameName.form);
        if (hasSameFormOwner && $inputWithSameName !== $input) {
          $inputWithSameName.checked = false;
          $component.syncConditionalRevealWithInputState($inputWithSameName);
        }
      });
    };

    /**
     * Uncheck exclusive checkboxes
     *
     * Find any checkbox inputs with the same name value and the 'exclusive' behaviour,
     * and uncheck them. This helps prevent someone checking both a regular checkbox and a
     * "None of these" checkbox in the same fieldset.
     *
     * @deprecated Will be made private in v5.0
     * @param {HTMLInputElement} $input - Checkbox input
     */
    Checkboxes.prototype.unCheckExclusiveInputs = function ($input) {
      var $component = this;

      /** @satisfies {NodeListOf<HTMLInputElement>} */
      var allInputsWithSameNameAndExclusiveBehaviour = document.querySelectorAll(
        'input[data-behaviour="exclusive"][type="checkbox"][name="' + $input.name + '"]'
      );

      allInputsWithSameNameAndExclusiveBehaviour.forEach(function ($exclusiveInput) {
        var hasSameFormOwner = ($input.form === $exclusiveInput.form);
        if (hasSameFormOwner) {
          $exclusiveInput.checked = false;
          $component.syncConditionalRevealWithInputState($exclusiveInput);
        }
      });
    };

    /**
     * Click event handler
     *
     * Handle a click within the $module – if the click occurred on a checkbox, sync
     * the state of any associated conditional reveal with the checkbox state.
     *
     * @deprecated Will be made private in v5.0
     * @param {MouseEvent} event - Click event
     */
    Checkboxes.prototype.handleClick = function (event) {
      var $clickedInput = event.target;

      // Ignore clicks on things that aren't checkbox inputs
      if (!($clickedInput instanceof HTMLInputElement) || $clickedInput.type !== 'checkbox') {
        return
      }

      // If the checkbox conditionally-reveals some content, sync the state
      var hasAriaControls = $clickedInput.getAttribute('aria-controls');
      if (hasAriaControls) {
        this.syncConditionalRevealWithInputState($clickedInput);
      }

      // No further behaviour needed for unchecking
      if (!$clickedInput.checked) {
        return
      }

      // Handle 'exclusive' checkbox behaviour (ie "None of these")
      var hasBehaviourExclusive = ($clickedInput.getAttribute('data-behaviour') === 'exclusive');
      if (hasBehaviourExclusive) {
        this.unCheckAllInputsExcept($clickedInput);
      } else {
        this.unCheckExclusiveInputs($clickedInput);
      }
    };

    return Checkboxes;

}));
//# sourceMappingURL=checkboxes.js.map
