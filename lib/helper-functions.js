const { dirname, join } = require('path')

/**
 * Convert a kebab-cased string to a PascalCased one
 *
 * @param {string} value - Input kebab-cased string
 * @returns {string} Output PascalCased string
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
 * @param {string} componentName - A kebab-cased component name
 * @returns {string} The name of its corresponding Nunjucks macro
 */
function componentNameToMacroName (componentName) {
  return `govuk${kebabCaseToPascalCase(componentName)}`
}

/**
 * Convert component name to its JavaScript class name
 *
 * @param {string} componentName - A kebab-cased component name
 * @returns {string} The name of its corresponding JavaScript class
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
 * @param {string} componentName - A kebab-cased component name
 * @returns {string} The name of its corresponding module
 */
function componentNameToJavaScriptModuleName (componentName) {
  return `GOVUKFrontend.${componentNameToJavaScriptClassName(componentName)}`
}

/**
 * Resolve path to package from any npm workspace
 *
 * Used by npm workspaces to find packages that might be hoisted to
 * the project root node_modules
 *
 * @param {string} packageName - Installed npm package name
 * @param {string} [childPath] - Optional child directory path
 * @returns {string} Path to installed npm package
 */
function packageNameToPath (packageName, childPath) {
  const packagePath = dirname(require.resolve(`${packageName}/package.json`))

  return childPath
    ? join(packagePath, childPath)
    : packagePath
}

module.exports = {
  componentNameToJavaScriptClassName,
  componentNameToMacroName,
  componentNameToJavaScriptModuleName,
  packageNameToPath
}
