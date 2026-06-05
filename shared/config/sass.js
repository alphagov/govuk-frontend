/**
 * @type {import('sass-embedded').Options<"async">}
 */
const deprecationOptions = {
  silenceDeprecations: ['import'],
  fatalDeprecations: ['global-builtin']
}

module.exports = {
  deprecationOptions
}
