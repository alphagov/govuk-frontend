/**
 * @type {import('sass-embedded').Options<"async">}
 */
const deprecationOptions = {
  silenceDeprecations: [
    'color-functions',
    'global-builtin',
    'import',
    'mixed-decls',
    'slash-div'
  ]
}

module.exports = {
  deprecationOptions
}
