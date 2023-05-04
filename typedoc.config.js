/**
 * @type {import('typedoc').TypeDocOptions}
 */
module.exports = {
  basePath: './src',
  emit: 'both',
  entryPoints: ['./packages/govuk-frontend/src/govuk/all.mjs'],
  name: 'govuk-frontend',
  out: './packages/govuk-frontend-review/dist/docs/jsdoc',
  tsconfig: './packages/govuk-frontend/tsconfig.build.json',
  sourceLinkTemplate: 'https://github.com/alphagov/govuk-frontend/blob/{gitRevision}/{path}#L{line}',

  // Ignore warnings about CharacterCountTranslations using I18n (@private)
  intentionallyNotExported: [
    'I18n',
    'TranslationPluralForms'
  ]
}
