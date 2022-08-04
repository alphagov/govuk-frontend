/**
 * TODO: Ideally this would be a NodeList.prototype.forEach polyfill
 * This seems to fail in IE8, requires more investigation.
 * See: https://github.com/imagitama/nodelist-foreach-polyfill
 */
export function nodeListForEach (nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback)
  }
  for (var i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes)
  }
}

// Used to generate a unique string, allows multiple instances of the component without
// Them conflicting with each other.
// https://stackoverflow.com/a/8809472
export function generateUniqueID () {
  var d = new Date().getTime()
  if (typeof window.performance !== 'undefined' && typeof window.performance.now === 'function') {
    d += window.performance.now() // use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

/*
 * Used to get the options of a component in the following order of precedence:
 * 1. Config passed into a component programmatically at construction
 * 2. Config derived by the data attributes of a component's element
 * 3. The component's default options
 *
 * I've gone back and forth on precedence. In cases where the options are
 * initialised using initAll(), it might make sense to be able to override
 * instances using the Data API/macros. The other argument for data attributes
 * taking precedence is keeping the need for JavaScript to a minimum, and
 * lowering the barrier to entry on using the Design System in a service.
 *
 * However, my assumption is that users mostly use our macros or HTML, and thus
 * we should treat any use of a programmatic API as the more specific need - it
 * could indicate a user needing to do something non-standard.
 *
 * Where this gets fuzzy is when components are programmatically initialised via
 * initAll(), but then data attributes/properties are used in individual macro
 * calls or HTML. I guess it's possible to keep track of where things are
 * initialised and introduce a level of precedence for initAll(), but that seems
 * like a nightmare to document for users and ensure consistency. 
 *
 * Since this would be common functionality across ALL components, it might make
 * sense to eventually put this in some kind of base component class which all
 * components inherit from. That would also mean fewer args to pass in.
 *
 * @TODO: Rewrite this in an ES5-friendly way
 * @TODO: Filter the dataset in case of clashes. We may want to investigate
 * using a namespaced prefix like data-govuk for our data attributes
 */
export function getOptions (passedOptions, moduleElement, defaultOptions) {
  return {
    ...defaultOptions,
    ...moduleElement.dataset,
    ...passedOptions
  }
}
