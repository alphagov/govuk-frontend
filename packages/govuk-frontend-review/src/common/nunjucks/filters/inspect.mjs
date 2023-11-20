import util from 'util'

/**
 * Format JavaScript objects as strings
 *
 * @param {unknown} object - JavaScript object to format
 * @returns {string} Formatted string
 */
export function inspect(object) {
  return util.inspect(object, {
    compact: false,
    depth: Infinity,
    maxArrayLength: Infinity,
    maxStringLength: Infinity
  })
}
