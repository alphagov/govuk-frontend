const { dirname, join, parse } = require('path')

const minimatch = require('minimatch')

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
function componentNameToClassName (componentName) {
  return kebabCaseToPascalCase(componentName)
}

/**
 * Convert component path to JavaScript UMD module name
 *
 * Used by Rollup to set the `window` global and UMD/AMD export name
 *
 * Component paths have kebab-cased file names (button.mjs, date-input.mjs),
 * whilst module names have a `GOVUKFrontend.` prefix and are PascalCased
 * (GOVUKFrontend.Button, GOVUKFrontend.CharacterCount)
 *
 * @param {string} componentPath - Path to component with kebab-cased file name
 * @returns {string} The name of its corresponding module
 */
function componentPathToModuleName (componentPath) {
  const { name } = parse(componentPath)

  return minimatch(componentPath, '**/components/**', { matchBase: true })
    ? `GOVUKFrontend.${componentNameToClassName(name)}`
    : 'GOVUKFrontend'
}

/**
 * Resolve path to package from any npm workspace
 *
 * Used by npm workspaces to find packages that might be hoisted to
 * the project root node_modules
 *
 * @param {string} packageName - Installed npm package name
 * @param {...string} [paths] - Optional child directory paths
 * @returns {string} Path to installed npm package
 */
function packageNameToPath (packageName, ...paths) {
  const packagePath = dirname(require.resolve(`${packageName}/package.json`))

  return paths?.length
    ? join(packagePath, ...paths)
    : packagePath
}

module.exports = {
  componentNameToClassName,
  componentNameToMacroName,
  componentPathToModuleName,
  packageNameToPath
}
