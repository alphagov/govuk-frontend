import { extractConfigByNamespace } from './index.mjs'
import { normaliseString } from './normalise-string.mjs'

/**
 * Normalise dataset
 *
 * Loop over an object and normalise each value using {@link normaliseString},
 * optionally expanding nested `i18n.field`
 *
 * @internal
 * @param {{ schema: Schema }} Component - Component class
 * @param {DOMStringMap} dataset - HTML element dataset
 * @returns {ObjectNested} Normalised dataset
 */
export function normaliseDataset(Component, dataset) {
  const out = /** @type {ReturnType<typeof normaliseDataset>} */ ({})

  // Normalise top-level dataset ('data-*') values using schema types
  for (const [field, property] of Object.entries(Component.schema.properties)) {
    if (field in dataset) {
      out[field] = normaliseString(dataset[field], property)
    }

    /**
     * Extract and normalise nested object values automatically using
     * {@link normaliseString} but only schema object types are allowed
     */
    if (property?.type === 'object') {
      out[field] = extractConfigByNamespace(Component, dataset, field)
    }
  }

  return out
}

/**
 * @internal
 * @typedef {import('./index.mjs').ObjectNested} ObjectNested
 * @typedef {import('./index.mjs').Schema} Schema
 */
