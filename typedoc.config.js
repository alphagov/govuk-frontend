/**
 * @type {import('typedoc').TypeDocOptions}
 */
module.exports = {
  emit: 'both',
  entryPoints: ['./src/govuk/all.mjs'],
  name: 'govuk-frontend',
  out: './app/dist/docs/jsdoc',
  tsconfig: './src/tsconfig.build.json',

  // Ignore warnings about CharacterCountTranslations using I18n (@private)
  intentionallyNotExported: [
    'I18n',
    'TranslationPluralForms'
  ]
}
