const { join } = require('path')

const {
  packageResolveToPath,
  packageNameToPath
} = require('@govuk-frontend/lib/names')

/**
 * @type {import('typedoc').TypeDocOptions}
 */
module.exports = {
  emit: 'both',
  name: 'govuk-frontend',
  sourceLinkTemplate:
    'https://github.com/alphagov/govuk-frontend/blob/{gitRevision}/{path}#L{line}',

  // Configure paths
  basePath: join(packageNameToPath('govuk-frontend'), 'src'),
  entryPoints: [packageResolveToPath('govuk-frontend/src/govuk/all.mjs')],
  tsconfig: packageResolveToPath('govuk-frontend/tsconfig.build.json'),
  out: './dist/docs/jsdoc',

  // Ignore warnings for JSDoc types not exports
  intentionallyNotExported: [
    'I18n',
    'TranslationPluralForms',

    // Rollup tree shaking export-only `index.mjs`
    '__module'
  ]
}
