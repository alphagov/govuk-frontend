(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('GOVUKFrontend.SkipLink', factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.GOVUKFrontend = global.GOVUKFrontend || {}, global.GOVUKFrontend.SkipLink = factory()));
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
     * Skip link component
     *
     * @class
     * @param {Element} $module - HTML element to use for skip link
     */
    function SkipLink ($module) {
      if (!($module instanceof HTMLAnchorElement)) {
        return this
      }

      /** @deprecated Will be made private in v5.0 */
      this.$module = $module;

      /** @deprecated Will be made private in v5.0 */
      this.$linkedElement = null;

      /** @deprecated Will be made private in v5.0 */
      this.linkedElementListener = false;
    }

    /**
     * Initialise component
     */
    SkipLink.prototype.init = function () {
      // Check that required elements are present
      if (!this.$module) {
        return
      }

      // Check for linked element
      var $linkedElement = this.getLinkedElement();
      if (!$linkedElement) {
        return
      }

      this.$linkedElement = $linkedElement;
      this.$module.addEventListener('click', this.focusLinkedElement.bind(this));
    };

    /**
     * Get linked element
     *
     * @deprecated Will be made private in v5.0
     * @returns {HTMLElement | null} $linkedElement - DOM element linked to from the skip link
     */
    SkipLink.prototype.getLinkedElement = function () {
      var linkedElementId = this.getFragmentFromUrl();
      if (!linkedElementId) {
        return null
      }

      return document.getElementById(linkedElementId)
    };

    /**
     * Focus the linked element
     *
     * Set tabindex and helper CSS class. Set listener to remove them on blur.
     *
     * @deprecated Will be made private in v5.0
     */
    SkipLink.prototype.focusLinkedElement = function () {
      var $linkedElement = this.$linkedElement;

      if (!$linkedElement.getAttribute('tabindex')) {
        // Set the element tabindex to -1 so it can be focused with JavaScript.
        $linkedElement.setAttribute('tabindex', '-1');
        $linkedElement.classList.add('govuk-skip-link-focused-element');

        // Add listener for blur on the focused element (unless the listener has previously been added)
        if (!this.linkedElementListener) {
          this.$linkedElement.addEventListener('blur', this.removeFocusProperties.bind(this));
          this.linkedElementListener = true;
        }
      }

      $linkedElement.focus();
    };

    /**
     * Remove the tabindex that makes the linked element focusable because the element only needs to be
     * focusable until it has received programmatic focus and a screen reader has announced it.
     *
     * Remove the CSS class that removes the native focus styles.
     *
     * @deprecated Will be made private in v5.0
     */
    SkipLink.prototype.removeFocusProperties = function () {
      this.$linkedElement.removeAttribute('tabindex');
      this.$linkedElement.classList.remove('govuk-skip-link-focused-element');
    };

    /**
     * Get fragment from URL
     *
     * Extract the fragment (everything after the hash symbol) from a URL, but not including
     * the symbol.
     *
     * @deprecated Will be made private in v5.0
     * @returns {string | undefined} Fragment from URL, without the hash symbol
     */
    SkipLink.prototype.getFragmentFromUrl = function () {
      // Bail if the anchor link doesn't have a hash
      if (!this.$module.hash) {
        return
      }

      return this.$module.hash.split('#').pop()
    };

    return SkipLink;

}));
//# sourceMappingURL=skip-link.js.map
