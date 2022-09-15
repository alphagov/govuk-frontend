/**
 * Convert a kebab-cased string to a PascalCased one
 *
 * @param {String} value -
 * @returns {String}
 */
function kebabCaseToPascalCase (value) {
  return value
    .toLowerCase()
    .split('-')
    // capitalize each 'word'
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

/**
 * Convert component name to macro name
 *
 * Component names are kebab-cased (button, date-input), whilst macro names have
 * a `govuk` prefix and are camel cased (govukButton, govukDateInput).
 *
 * @param {String} componentName - A kebab-cased component name
 * @returns {String} The name of its corresponding Nunjucks macro
 */
function componentNameToMacroName (componentName) {
  return `govuk${kebabCaseToPascalCase(componentName)}`
}

/**
 * Convert component name to its JavaScript class name
 *
 * @param {String} componentName - A kebab-cased component name
 * @returns {String} The name of its corresponding JavaScript class
 */
function componentNameToJavaScriptClassName (componentName) {
  return kebabCaseToPascalCase(componentName)
}

/**
 * Convert component name to JavaScript UMD module name
 *
 * Used by rollup to set the `window` global and UMD/AMD export name
 *
 * Component names are kebab-cased strings (button, date-input), whilst module
 * names have a `GOVUKFrontend.` prefix and are PascalCased
 * (GOVUKFrontend.Button, GOVUKFrontend.CharacterCount).
 *
 * @param {String} componentName - A kebab-cased component name
 * @returns {String} The name of its corresponding module
 */
function componentNameToJavaScriptModuleName (componentName) {
  return `GOVUKFrontend.${componentNameToJavaScriptClassName(componentName)}`
}

module.exports = {
  componentNameToJavaScriptClassName,
  componentNameToMacroName,
  componentNameToJavaScriptModuleName
}
