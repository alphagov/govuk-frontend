'use strict'

// components have dashes in names whereas macros have govukPascalCase syntax
const capitaliseComponentName = string => {
  string = string.toLowerCase().split('-')
  for (var i = 0; i < string.length; i++) {
    string[i] = string[i].charAt(0).toUpperCase() + string[i].slice(1)
  }
  return string.join('')
}

exports.capitaliseComponentName = capitaliseComponentName
