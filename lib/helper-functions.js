'use strict'

// Convert component name to macro name
//
// This helper function takes a component name and returns the corresponding
// macro name.
//
// Component names are lowercase, dash-separated strings (button, date-input),
// whilst macro names have a `govuk` prefix and are camel cased (govukButton,
// govukDateInput).
const componentNameToMacroName = componentName => {
  const macroName = componentName
    .toLowerCase()
    .split('-')
    // capitalize each 'word'
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')

  return `govuk${macroName}`
}
exports.componentNameToMacroName = componentNameToMacroName
