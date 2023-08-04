const { dirname, join } = require('path')
const { pathToFileURL } = require('url')

const nunjucks = require('nunjucks')
const { outdent } = require('outdent')

const { getListing, getDirectories } = require('./files')
const { packageTypeToPath, componentNameToMacroName } = require('./names')

// Nunjucks default environment
const env = nunjucksEnv()

// Paths to entry styles and scripts
const [stylesPath, scriptsPath, assetPath] = [
  'govuk-frontend.min.css',
  'govuk-frontend.min.js',
  'assets'
].map((modulePath) =>
  pathToFileURL(packageTypeToPath('govuk-frontend', { modulePath }))
)

/**
 * Nunjucks environment factory
 *
 * @param {string[]} [searchPaths] - Nunjucks search paths (optional)
 * @param {import('nunjucks').ConfigureOptions} [nunjucksOptions] - Nunjucks options (optional)
 * @param {import('./names').PackageOptions} [packageOptions] - Package options (optional)
 * @returns {import('nunjucks').Environment} Nunjucks environment
 */
function nunjucksEnv(searchPaths = [], nunjucksOptions = {}, packageOptions) {
  const packagePath = dirname(
    packageTypeToPath('govuk-frontend', packageOptions)
  )

  // Add to Nunjucks search paths (without 'govuk' suffix)
  searchPaths.push(join(packagePath, '../'))

  // Nunjucks environment
  return nunjucks.configure(searchPaths, {
    trimBlocks: true, // automatically remove trailing newlines from a block/tag
    lstripBlocks: true, // automatically remove leading whitespace from a block/tag,
    ...nunjucksOptions
  })
}

/**
 * Load single component fixtures
 *
 * @param {string} componentName - Component name
 * @param {import('./names').PackageOptions} [packageOptions] - Package options (optional)
 * @returns {Promise<ComponentFixtures>} Component data
 */
const getComponentFixtures = async (componentName, packageOptions) => {
  return require(
    join(
      dirname(packageTypeToPath('govuk-frontend', packageOptions)),
      `components/${componentName}/fixtures.json`
    )
  )
}

/**
 * Load all components' data
 *
 * @param {import('./names').PackageOptions} [packageOptions] - Package options (optional)
 * @returns {Promise<(ComponentFixtures)[]>} Components' data
 */
const getComponentsFixtures = async (packageOptions) => {
  const componentNames = await getComponentNames(packageOptions)
  return Promise.all(
    componentNames.map((componentName) =>
      getComponentFixtures(componentName, packageOptions)
    )
  )
}

/**
 * Get component files
 *
 * @param {string} [componentName] - Component name
 * @param {import('./names').PackageOptions} [packageOptions] - Package options (optional)
 * @returns {Promise<string[]>} Component files
 */
const getComponentFiles = (componentName = '*', packageOptions) =>
  getListing(
    join(
      dirname(packageTypeToPath('govuk-frontend', packageOptions)),
      `components/${componentName}/**/*`
    )
  )

/**
 * Get component names
 *
 * @param {import('./names').PackageOptions} [packageOptions] - Package options (optional)
 * @returns {Promise<string[]>} Component names
 */
async function getComponentNames(packageOptions) {
  return getDirectories(
    join(
      dirname(packageTypeToPath('govuk-frontend', packageOptions)),
      'components/'
    )
  )
}

/**
 * Get component names, filtered
 *
 * @param {(componentName: string, componentFiles: string[]) => boolean} filter - Component names array filter
 * @param {import('./names').PackageOptions} [packageOptions] - Package options (optional)
 * @returns {Promise<string[]>} Component names
 */
async function getComponentNamesFiltered(filter, packageOptions) {
  const componentNames = await getComponentNames(packageOptions)
  const componentFiles = await getComponentFiles('*', packageOptions)

  // Apply component names filter
  return componentNames.filter((componentName) =>
    filter(componentName, componentFiles)
  )
}

/**
 * Get examples from component fixtures
 *
 * @param {string} componentName - Component name
 * @param {import('./names').PackageOptions} [packageOptions] - Package options (optional)
 * @returns {Promise<{ [name: string]: MacroRenderOptions }>} Component examples as an object
 */
async function getExamples(componentName, packageOptions) {
  const { fixtures } = await getComponentFixtures(componentName, packageOptions)

  /** @type {{ [name: string]: MacroRenderOptions }} */
  const examples = {}

  for (const fixture of fixtures) {
    examples[fixture.name] = {
      context: fixture.options,
      fixture
    }
  }

  return examples
}

/**
 * Render component HTML
 *
 * @param {string} componentName - Component name
 * @param {MacroRenderOptions} [options] - Nunjucks macro render options
 * @returns {string} HTML rendered by the component
 */
function render(componentName, options) {
  const macroName = componentNameToMacroName(componentName)
  const macroPath = `govuk/components/${componentName}/macro.njk`

  // On Heroku / CI we know we're running against an up-to-date build so we can
  // use the generated HTML from the component JSON (where it exists) to make
  // things faster
  if ((process.env.HEROKU_APP || process.env.CI) && options?.fixture?.html) {
    return options.fixture.html
  }

  return renderMacro(macroName, macroPath, options)
}

/**
 * Render macro HTML
 *
 * @param {string} macroName - The name of the macro
 * @param {string} macroPath - The path to the file containing the macro
 * @param {MacroRenderOptions} [options] - Nunjucks macro render options
 * @returns {string} HTML rendered by the macro
 */
function renderMacro(macroName, macroPath, options) {
  const paramsFormatted = JSON.stringify(options?.context ?? {}, undefined, 2)

  let macroString = `{%- from "${macroPath}" import ${macroName} -%}`

  // If we're nesting child components or text, pass the children to the macro
  // using the 'caller' Nunjucks feature
  macroString += options?.callBlock
    ? `{%- call ${macroName}(${paramsFormatted}) -%}${options.callBlock}{%- endcall -%}`
    : `{{- ${macroName}(${paramsFormatted}) -}}`

  return renderString(macroString, options)
}

/**
 * Render component preview on boilerplate page
 *
 * Uses {@link renderTemplate} with the default `govuk/template.njk` to
 * render components via {@link render} into the `main` content block
 *
 * @param {string} [componentName] - Component name
 * @param {MacroRenderOptions} [options] - Nunjucks macro render options
 * @returns {string} HTML rendered from the Nunjucks template
 */
function renderPreview(componentName, options) {
  return renderTemplate('govuk/template.njk', {
    blocks: {
      pageTitle: 'Test boilerplate - GOV.UK',
      head: outdent`
        <link rel="stylesheet" href="${stylesPath}">

        <script type="importmap">
          { "imports": { "govuk-frontend": "${scriptsPath}" } }
        </script>
      `,

      // Remove default template blocks
      skipLink: '',
      bodyStart: '',
      header: '',
      footer: '',

      main: outdent`
        <div id="content" class="govuk-width-container">
          ${componentName ? render(componentName, options) : ''}
        </div>

        <!--
          Target for references in examples (e.g. aria-controls)
          https://dequeuniversity.com/rules/axe/4.8/aria-valid-attr-value
        -->
        <div id="test-target-element"></div>
      `,

      bodyEnd: outdent`
        <script type="module" src="${scriptsPath}"></script>
      `
    },
    context: {
      assetPath,
      mainClasses: 'govuk-main-wrapper--auto-spacing'
    }
  })
}

/**
 * Render string
 *
 * @param {string} string - Nunjucks string to render
 * @param {MacroRenderOptions | TemplateRenderOptions} [options] - Nunjucks render options
 * @returns {string} HTML rendered from the Nunjucks string
 */
function renderString(string, options) {
  const nunjucksEnv = options?.env ?? env
  return nunjucksEnv.renderString(string, options?.context ?? {})
}

/**
 * Render template HTML
 *
 * @param {string} templatePath - Nunjucks template path
 * @param {TemplateRenderOptions} [options] - Nunjucks template render options
 * @returns {string} HTML rendered by template.njk
 */
function renderTemplate(templatePath, options) {
  let viewString = `{% extends "${templatePath}" %}`

  if (options?.blocks) {
    for (const [name, content] of Object.entries(options.blocks)) {
      viewString += outdent`

        {% block ${name} -%}
          ${content}
        {%- endblock %}`
    }
  }

  return renderString(viewString, options)
}

module.exports = {
  getComponentFixtures,
  getComponentsFixtures,
  getComponentFiles,
  getComponentNames,
  getComponentNamesFiltered,
  getExamples,
  nunjucksEnv,
  render,
  renderMacro,
  renderPreview,
  renderString,
  renderTemplate,
  stylesPath,
  scriptsPath,
  assetPath
}

/**
 * Component data
 *
 * @typedef {object} ComponentData
 * @property {{ [param: string]: ComponentOption }} params - Nunjucks macro option (or param) configs
 * @property {ComponentExample[]} [examples] - Component examples with Nunjucks macro options (or params)
 * @property {string} [previewLayout] - Nunjucks layout for component preview
 * @property {string} [accessibilityCriteria] - Accessibility criteria
 */

/**
 * Nunjucks macro option (or param) config
 *
 * @typedef {object} ComponentOption
 * @property {'array' | 'boolean' | 'integer' | 'nunjucks-block' | 'object' | 'string'} type - Option type
 * @property {boolean} required - Option required
 * @property {string} description - Option description
 * @property {boolean} [isComponent] - Option is another component
 * @property {{ [param: string]: ComponentOption }} [params] - Nunjucks macro option (or param) configs
 */

/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @typedef {object} ComponentExample
 * @property {string} name - Example name
 * @property {string} [description] - Example description
 * @property {boolean} [hidden] - Example hidden from review app
 * @property {string[]} [previewLayoutModifiers] - Component preview layout class modifiers
 * @property {MacroOptions} options - Nunjucks macro options (or params)
 */

/**
 * Nunjucks macro options
 *
 * @typedef {{ [param: string]: unknown }} MacroOptions
 */

/**
 * Component fixture
 * (used by the Design System website)
 *
 * @typedef {Required<ComponentExample> & { html: string }} ComponentFixture
 */

/**
 * Nunjucks macro render options
 *
 * @typedef {object} MacroRenderOptions
 * @property {MacroOptions | unknown} [context] - Nunjucks mixed context (optional)
 * @property {string} [callBlock] - Nunjucks macro `caller()` content (optional)
 * @property {import('nunjucks').Environment} [env] - Nunjucks environment (optional)
 * @property {ComponentFixture} [fixture] - Component fixture (optional)
 */

/**
 * Nunjucks template render options
 *
 * @typedef {object} TemplateRenderOptions
 * @property {object} [context] - Nunjucks context object (optional)
 * @property {{ [blockName: string]: string }} [blocks] - Nunjucks blocks (optional)
 * @property {import('nunjucks').Environment} [env] - Nunjucks environment (optional)
 */

/**
 * Component fixtures
 * (used by the Design System website)
 *
 * @typedef {object} ComponentFixtures
 * @property {string} component - Component name
 * @property {ComponentFixture[]} fixtures - Component fixtures with Nunjucks macro options (or params)
 * @property {string} [previewLayout] - Nunjucks layout for component preview
 */
