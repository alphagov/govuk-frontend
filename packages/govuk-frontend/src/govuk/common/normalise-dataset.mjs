import { extractConfigByNamespace } from './index.mjs'
import { normaliseString } from './normalise-string.mjs'

/**
 * Normalise dataset
 *
 * Loop over an object and normalise each value using {@link normaliseString},
 * optionally expanding nested `i18n.field`
 *
 * @internal
 * @param {DOMStringMap} dataset - HTML element dataset
 * @param {Schema} schema - Component config schema
 * @returns {ObjectNested} Normalised dataset
 */
export function normaliseDataset(dataset, schema) {
  const out = /** @type {ObjectNested} */ ({})

  // Loop known properties from config schema
  for (const field of Object.keys(schema.properties)) {
    const options = schema.properties[field]

    // Normalise top-level dataset ('data-*') values
    // but discard if type does not match schema
    if (field in dataset && options.type === typeof out[field]) {
      out[field] = normaliseString(dataset[field])
    }

    /**
     * Extract and normalise nested object values automatically using
     * {@link normaliseString} but without schema types
     */
    if (options.type === 'object') {
      out[field] = extractConfigByNamespace(dataset, field)
    }
  }

  return out
}

/**
 * @internal
 * @typedef {import('./index.mjs').ObjectNested} ObjectNested
 * @typedef {import('./index.mjs').Schema} Schema
 */
