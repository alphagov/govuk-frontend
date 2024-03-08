import { normaliseString } from './normalise-string.mjs'

/**
 * Normalise dataset
 *
 * Loop over an object and normalise each value using {@link normaliseString}
 *
 * @internal
 * @param {DOMStringMap} dataset - HTML element dataset
 * @param {{ schema: Schema }} Component - Component class
 * @returns {{ [key: string]: string | boolean | number | undefined }} Normalised dataset
 */
export function normaliseDataset(dataset, Component) {
  const out = /** @type {ReturnType<typeof normaliseDataset>} */ ({})

  // Normalise top-level dataset ('data-*') values
  for (const [field, property] of Object.entries(Component.schema.properties)) {
    if (field in dataset) {
      const value = normaliseString(dataset[field])

      // But skip if type does not match schema
      // eslint-disable-next-line valid-typeof
      if (property?.type === typeof value) {
        out[field] = value
      }
    }
  }

  return out
}

/**
 * @internal
 * @typedef {import('./index.mjs').Schema} Schema
 */
