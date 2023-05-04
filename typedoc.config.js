/**
 * @type {import('typedoc').TypeDocOptions}
 */
module.exports = {
  basePath: './src',
  emit: 'both',
  entryPoints: ['./src/govuk/all.mjs'],
  name: 'govuk-frontend',
  out: './app/dist/docs/jsdoc',
  tsconfig: './src/tsconfig.build.json',
  sourceLinkTemplate: 'https://github.com/alphagov/govuk-frontend/blob/{gitRevision}/{path}#L{line}',

  // Ignore warnings about CharacterCountTranslations using I18n (@private)
  intentionallyNotExported: [
    'I18n',
    'TranslationPluralForms'
  ]
}
