'use strict'

/**
 * Convert kebab-cased component name to PascalCase
 */
function componentNameToPascalCase (componentName) {
  return componentName
    .toLowerCase()
    .split('-')
    // capitalize each 'word'
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

/**
 * Convert component name to macro name
 *
 * Component names are kebab-cased (button, date-input), whilst macro names have
 * a `govuk` prefix and are camel cased (govukButton, govukDateInput).
 */
function componentNameToMacroName (componentName) {
  return `govuk${componentNameToPascalCase(componentName)}`
}

/**
 * Convert component name to JavaScript UMD module name
 *
 * Used by rollup to set the `window` global and UMD/AMD export name
 *
 * Component names are kebab-cased strings (button, date-input), whilst module
 * names have a `GOVUKFrontend.` prefix and are pascal cased
 * (GOVUKFrontend.Button, GOVUKFrontend.CharacterCount).
 */
function componentNameToJavaScriptModuleName (componentName) {
  return `GOVUKFrontend.${componentNameToPascalCase(componentName)}`
}

module.exports = {
  componentNameToPascalCase,
  componentNameToMacroName,
  componentNameToJavaScriptModuleName
}
