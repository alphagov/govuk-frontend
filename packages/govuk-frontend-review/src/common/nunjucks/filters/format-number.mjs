/**
 * Format number
 *
 * @param {string | number} number - Number to format
 * @returns {string} Number as formatted string
 */
export function formatNumber (number) {
  return Number(number).toLocaleString('en', {
    useGrouping: true
  })
}
