import { readFile } from 'fs/promises'
import { join } from 'path'

import { paths } from '@govuk-frontend/config'
import { getDirectories, getListing } from '@govuk-frontend/lib/files'
import fm from 'front-matter'

/**
 * Load all full page examples' front matter
 *
 * @returns {Promise<FullPageExample[]>} Full page examples
 */
export async function getFullPageExamples() {
  const examplesPath = join(paths.app, 'src/views/full-page-examples')
  const directories = await getDirectories(examplesPath)

  /**
   * Add metadata (front matter) to each example
   *
   * @type {FullPageExample[]}
   */
  const examples = await Promise.all(
    directories.map(async (exampleName) => {
      const { attributes } = fm(
        await readFile(join(examplesPath, exampleName, 'index.njk'), 'utf8')
      )

      const exampleFiles = await getListing('*', {
        cwd: join(examplesPath, exampleName)
      })

      return {
        name: exampleName,
        path: exampleName,
        files: exampleFiles,

        // Add flags for Nunjucks filtering
        hasPageConfirm: exampleFiles.includes('confirm.njk'),

        // Add metadata (front matter)
        ...attributes
      }
    })
  )

  const collator = new Intl.Collator('en', {
    sensitivity: 'base'
  })

  return examples.sort(({ name: a }, { name: b }) => collator.compare(a, b))
}

/**
 * Full page example from front matter
 *
 * @typedef {object} FullPageExample
 * @property {string} name - Example name
 * @property {string} path - Example directory name
 * @property {string} title - Example title
 * @property {string[]} files - Example file names
 * @property {boolean} hasPageConfirm - Whether example has confirm page
 * @property {string} [scenario] - Description explaining the example
 * @property {string} [notes] - Additional notes about the example
 */
