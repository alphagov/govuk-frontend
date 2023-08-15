const { dirname, join, parse } = require('path')

const { paths } = require('@govuk-frontend/config')
const { minimatch } = require('minimatch')

/**
 * Convert a kebab-cased string to a PascalCased one
 *
 * @param {string} value - Input kebab-cased string
 * @returns {string} Output PascalCased string
 */
function kebabCaseToPascalCase(value) {
  return (
    value
      .toLowerCase()
      .split('-')
      // capitalize each 'word'
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  )
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
function componentNameToMacroName(componentName) {
  return `govuk${kebabCaseToPascalCase(componentName)}`
}

/**
 * Convert component name to its JavaScript class name
 *
 * @param {string} componentName - A kebab-cased component name
 * @returns {string} The name of its corresponding JavaScript class
 */
function componentNameToClassName(componentName) {
  return kebabCaseToPascalCase(componentName)
}

/**
 * Convert component path to JavaScript module name
 *
 * Used by Rollup to set Universal Module Definition (UMD) export names for
 * `window` globals maintaining compatibility with CommonJS and AMD `require()`
 *
 * Component paths have kebab-cased file names (button.mjs, date-input.mjs),
 * whilst module names have a `GOVUKFrontend.` prefix and are PascalCased
 * (GOVUKFrontend.Button, GOVUKFrontend.CharacterCount)
 *
 * @param {string} componentPath - Path to component with kebab-cased file name
 * @returns {string} The name of its corresponding module
 */
function componentPathToModuleName(componentPath) {
  const { name } = parse(componentPath)

  return minimatch(componentPath, '**/components/**', { matchBase: true })
    ? `GOVUKFrontend.${componentNameToClassName(name)}`
    : 'GOVUKFrontend'
}

/**
 * Resolve path to package entry from any npm workspace
 *
 * Once the package entry is resolved, the option `modulePath` can be used to
 * append a new path relative to the package entry, for example `i18n.mjs`
 *
 * @param {string} packageEntry - Installed npm package entry, for example `govuk-frontend/src/govuk/all.mjs`
 * @param {Pick<PackageOptions, "modulePath" | "moduleRoot">} [options] - Package resolution options
 * @returns {string} Path to installed npm package entry
 */
function packageResolveToPath(packageEntry, { modulePath, moduleRoot } = {}) {
  const packagePath = require.resolve(packageEntry, {
    paths: [moduleRoot ?? paths.root]
  })

  // Append optional module path
  return modulePath !== undefined
    ? join(dirname(packagePath), modulePath)
    : packagePath
}

/**
 * Return path to package entry from any npm workspace, by type
 *
 * Wraps {@link packageResolveToPath} to allow the appended `modulePath` to
 * include unresolvable paths, globs or files that are not yet built
 *
 * {@link https://github.com/alphagov/govuk-frontend/issues/3755}
 *
 * @example
 * Resolving components relative to a default package entry
 *
 * - GOV.UK Frontend v4 './govuk/components/accordion/accordion.mjs'
 * - GOV.UK Frontend v5 './dist/govuk/components/accordion/accordion.mjs'
 *
 * ```mjs
 * const templatePath = packageResolveToPath('govuk-frontend', {
 *   modulePath: `components/accordion/accordion.mjs`
 * })
 * ```
 * @param {string} packageName - Installed npm package name
 * @param {PackageOptions} [options] - Package resolution options
 * @returns {string} Path to installed npm package field
 */
function packageTypeToPath(
  packageName,
  { modulePath, moduleRoot, type = 'commonjs' } = {}
) {
  const packageEntry = `${packageName}/package.json`
  const packageField = type === 'module' ? 'module' : 'main'

  // Package field as child path
  const entryPath = require(packageResolveToPath(packageEntry, { moduleRoot }))[
    packageField
  ]
  const childPath =
    modulePath !== undefined ? join(dirname(entryPath), modulePath) : entryPath

  // Append optional module path
  return packageResolveToPath(packageEntry, {
    modulePath: childPath,
    moduleRoot
  })
}

/**
 * Resolve path to package from any npm workspace
 *
 * Used to find npm workspace packages that might be hoisted to
 * the project root node_modules
 *
 * @param {string} packageName - Installed npm package name
 * @param {Pick<PackageOptions, "moduleRoot">} [options] - Package resolution options
 * @returns {string} Path to installed npm package
 */
function packageNameToPath(packageName, options) {
  return packageResolveToPath(`${packageName}/package.json`, {
    modulePath: '',
    ...options
  })
}

module.exports = {
  componentNameToClassName,
  componentNameToMacroName,
  componentPathToModuleName,
  packageResolveToPath,
  packageTypeToPath,
  packageNameToPath
}

/**
 * @typedef {object} PackageOptions
 * @property {string} [type=commonjs] - Package type from package.json, for example `module`
 * @property {string} [modulePath] - Module path (optional, relative to package entry), for example `i18n.mjs`
 * @property {string} [moduleRoot] - Module root (optional, absolute directory path to resolve `node_modules` from)
 */
