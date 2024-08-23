const { join, relative } = require('path')

const { paths } = require('@govuk-frontend/config')
const {
  packageResolveToPath,
  packageNameToPath
} = require('@govuk-frontend/lib/names')
const slash = require('slash')
const typedoc = require('typedoc')

const basePath = join(packageNameToPath('govuk-frontend'), 'src')
const workspacePath = slash(relative(paths.root, basePath))
const { HEROKU_APP, HEROKU_BRANCH = 'main' } = process.env

/**
 * @type {import('typedoc').TypeDocOptions}
 */
module.exports = {
  disableGit: !!HEROKU_APP,
  emit: 'both',
  name: 'govuk-frontend',
  sourceLinkTemplate: HEROKU_APP
    ? `https://github.com/alphagov/govuk-frontend/blob/${HEROKU_BRANCH}/${workspacePath}/{path}#L{line}`
    : `https://github.com/alphagov/govuk-frontend/blob/{gitRevision}/{path}#L{line}`,

  // Configure paths
  basePath,
  entryPoints: [packageResolveToPath('govuk-frontend/src/govuk/all.mjs')],
  tsconfig: packageResolveToPath('govuk-frontend/tsconfig.build.json'),
  out: './dist/docs/jsdoc',

  // Turn off strict checks for JSDoc output
  // since `lint:types` will already log issues
  compilerOptions: {
    strict: false
  },

  // Document private methods. These are behind a checkbox in the
  // settings menu of the JSDoc page.
  excludePrivate: false,

  plugin: [
    // Use typedoc-plugin-missing-exports to ensure that internal symbols which
    // are not exported are included in the documentation (like the `I18n` class
    // or the components' config types)
    'typedoc-plugin-missing-exports'
  ],
  // By default, missing-exports will regroup all symbols under an `<internal>`
  // module whose naming is a bit poor. Instead, we let the symbols be displayed
  // alongside the others
  placeInternalsInOwningModule: true,
  // The missing-exports plugin will include built-in symbols, like the DOM API.
  // We don't want those in our documentation, so we need to exclude them
  excludeExternals: true,

  // Make TypeDoc aware of tags we use but it does not parse by default
  // so it doesn't warn unnecessarily
  modifierTags: [
    ...typedoc.Configuration.OptionDefaults.modifierTags,
    '@preserve',
    '@constant'
  ],

  // We don't want typedoc to render a 'Preserve' tag
  // as it's only for controlling which comments get rendered or not
  // after transpilation
  excludeTags: ['@preserve']
}
