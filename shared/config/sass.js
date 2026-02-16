/**
 * @type {import('sass-embedded').Options<"async">}
 */
const deprecationOptions = {
  silenceDeprecations: ['import', 'mixed-decls'],
  fatalDeprecations: ['global-builtin']
}

module.exports = {
  deprecationOptions
}
