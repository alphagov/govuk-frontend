(function (undefined) {
  var detect = (
    'indexOf' in Array.prototype
  )

  if (detect) return

  // Polyfill adapted from https://cdn.polyfill.io/v2/polyfill.js?features=Array.prototype.indexOf&flags=always
  Array.prototype.indexOf = function (searchElement, fromIndex) {
    fromIndex = Number(fromIndex) || 0

    if (this === undefined || this === null) {
      throw new TypeError(this + ' is not an object')
    }

    var array = this instanceof String ? this.split('') : this
    var arrayLength = Math.max(Math.min(array.length, 9007199254740991), 0) || 0
    var loopStartIndex = (fromIndex < 0 ? Math.max(arrayLength + fromIndex, 0) : fromIndex) - 1

    for (var i = loopStartIndex; ++i < arrayLength;) {
      if (i in array && array[i] === searchElement) {
        return i
      }
    }
    return -1
  }
}).call(typeof window === 'object' && window || typeof self === 'object' && self || typeof global === 'object' && global || {})