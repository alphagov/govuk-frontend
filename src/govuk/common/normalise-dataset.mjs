import { normaliseString } from './normalise-string.mjs'

/**
 * Normalise dataset
 *
 * Loop over an object and normalise each value using normaliseData function
 *
 * @internal
 * @param {DOMStringMap} dataset - HTML element dataset
 * @returns {{ [key: string]: string | boolean | number | undefined }} Normalised dataset
 */
export function normaliseDataset(dataset) {
  /** @type {ReturnType<typeof normaliseDataset>} */
  const out = {}

  for (const [key, value] of Object.entries(dataset)) {
    out[key] = normaliseString(value)
  }

  return out
}
