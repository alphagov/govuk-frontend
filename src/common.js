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

export function extractDatasetOptions ($element) {
  var dataset = {}
  var attributes = $element.attributes
  if (!attributes) {
    return dataset
  }
  for (var i = 0; i < attributes.length; i++) {
    var attribute = attributes[i]
    var match = attribute.name.match(/^data-(.+)/)
    if (!match) {
      continue
    }

    var value = attribute.value
    var key = match[1]

    if (!isNaN(value)) {
      dataset[key] = parseInt(value, 10)
    } else if(value === 'true') {
      dataset[key] = true
    } else if(value === 'false') {
      dataset[key] = false
    } else {
      dataset[key] = value
    }
  }
  return dataset
}