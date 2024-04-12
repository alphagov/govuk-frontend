import slug from 'slug'

/**
 * Format strings into URL friendly "slug"
 *
 * @param {string} string - String to format
 * @returns {string} URL friendly "slug"
 */
export function slugify(string) {
  return slug(string, { lower: true })
}
