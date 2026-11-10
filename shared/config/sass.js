/**
 * @satisfies {Options<"async">}}
 */
const deprecationOptions = {
  silenceDeprecations: ['import'],
  fatalDeprecations: ['global-builtin']
}

module.exports = {
  deprecationOptions
}

/**
 * @import {Options} from 'sass-embedded'
 */
