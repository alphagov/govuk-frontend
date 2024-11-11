/**
 * @type {import('sass-embedded').Options<"async">}
 */
const deprecationOptions = {
  silenceDeprecations: ['slash-div', 'mixed-decls', 'import', 'global-builtin'],
  quietDeps: true
}

module.exports = {
  deprecationOptions
}
