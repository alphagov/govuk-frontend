import { readFile } from 'fs/promises'
import { join } from 'path'

import fm from 'front-matter'
import { paths } from 'govuk-frontend-config'
import { getDirectories } from 'govuk-frontend-lib/files'

/**
 * Get example names
 *
 * @returns {Promise<string[]>} Component names
 */
export function getExampleNames () {
  return getDirectories(join(paths.app, 'src/views/examples'))
}

/**
 * Load all full page examples' front matter
 *
 * @returns {Promise<FullPageExample[]>} Full page examples
 */
export async function getFullPageExamples () {
  const directories = await getDirectories(join(paths.app, 'src/views/full-page-examples'))

  // Add metadata (front matter) to each example
  const examples = await Promise.all(directories.map(async (exampleName) => {
    const templatePath = join(paths.app, 'src/views/full-page-examples', exampleName, 'index.njk')
    const { attributes } = fm(await readFile(templatePath, 'utf8'))

    return {
      name: exampleName,
      path: exampleName,
      ...attributes
    }
  }))

  const collator = new Intl.Collator('en', {
    sensitivity: 'base'
  })

  return examples.sort(({ name: a }, { name: b }) =>
    collator.compare(a, b))
}

/**
 * Full page example from front matter
 *
 * @typedef {object} FullPageExample
 * @property {string} name - Example name
 * @property {string} [scenario] - Description explaining the example
 * @property {string} [notes] - Additional notes about the example
 */
