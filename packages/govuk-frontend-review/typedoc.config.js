const { join, relative } = require('path')

const { paths } = require('@govuk-frontend/config')
const {
  packageResolveToPath,
  packageNameToPath
} = require('@govuk-frontend/lib/names')
const slash = require('slash')

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

  // Ignore known undocumented types (@internal, @private etc)
  intentionallyNotExported: ['I18n', 'TranslationPluralForms']
}
