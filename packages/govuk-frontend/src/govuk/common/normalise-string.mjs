/**
 * Normalise string
 *
 * 'If it looks like a duck, and it quacks like a duck…' 🦆
 *
 * If the passed value looks like a boolean or a number, convert it to a boolean
 * or number.
 *
 * Designed to be used to convert config passed via data attributes (which are
 * always strings) into something sensible.
 *
 * @internal
 * @param {string | undefined} value - The value to normalise
 * @param {SchemaProperty} [options] - Component config schema property options
 * @returns {string | boolean | number | undefined} Normalised data
 */
export function normaliseString(value, options) {
  let output = /** @type {ReturnType<normaliseString>} */ (value)

  // Skip conversion
  if (typeof value !== 'string') {
    return value
  }

  const trimmedValue = value.trim()

  // No schema type set? Determine automatically
  if (!options?.type) {
    options = { type: 'string' }

    // Type: Boolean
    if (['true', 'false'].includes(trimmedValue)) {
      options.type = 'boolean'
    }

    // Type: Number
    if (trimmedValue.length > 0 && isFinite(Number(trimmedValue))) {
      options.type = 'number'
    }
  }

  switch (options.type) {
    case 'boolean':
      output = trimmedValue === 'true'
      break

    case 'number':
      output = Number(trimmedValue)
      break
  }

  return output
}

/**
 * @typedef {import('./index.mjs').SchemaProperty} SchemaProperty
 */
