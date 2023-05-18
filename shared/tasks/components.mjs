import { readFile } from 'fs/promises'
import { basename, dirname, join } from 'path'

import { getListing } from 'govuk-frontend-lib/files'
import yaml from 'js-yaml'
import nunjucks from 'nunjucks'

import { files } from './index.mjs'

/**
 * Generate fixtures.json from component data
 *
 * @param {AssetEntry[0]} pattern - Path to ${componentName}.yaml
 * @param {AssetEntry[1]} options - Asset options
 */
export async function generateFixtures (pattern, { srcPath, destPath }) {
  const componentDataPaths = await getListing(srcPath, pattern)

  // Loop component data paths
  const fixtures = componentDataPaths.map(async (componentDataPath) => {
    const fixture = await generateFixture(join(srcPath, componentDataPath))

    // Write to destination
    await files.write(componentDataPath, {
      srcPath,
      destPath,

      // Rename to fixtures.json
      filePath ({ dir }) {
        return join(dir, 'fixtures.json')
      },

      // Replace contents with JSON
      async fileContents () {
        return JSON.stringify(fixture, null, 4)
      }
    })
  })

  await Promise.all(fixtures)
}

/**
 * Generate macro-options.json from component data
 *
 * @param {AssetEntry[0]} pattern - Path to ${componentName}.yaml
 * @param {AssetEntry[1]} options - Asset options
 */
export async function generateMacroOptions (pattern, { srcPath, destPath }) {
  const componentDataPaths = await getListing(srcPath, pattern)

  // Loop component data paths
  const macroOptions = componentDataPaths.map(async (componentDataPath) => {
    const macroOption = await generateMacroOption(join(srcPath, componentDataPath))

    // Write to destination
    await files.write(componentDataPath, {
      srcPath,
      destPath,

      // Rename to 'macro-options.json'
      filePath ({ dir }) {
        return join(dir, 'macro-options.json')
      },

      // Replace contents with JSON
      async fileContents () {
        return JSON.stringify(macroOption, null, 4)
      }
    })
  })

  await Promise.all(macroOptions)
}

/**
 * Component fixtures YAML to JSON
 *
 * @param {string} componentDataPath - Path to ${componentName}.yaml
 * @returns {Promise<{ component: string; fixtures: { [key: string]: unknown }[] }>} Component fixtures object
 */
async function generateFixture (componentDataPath) {
  /** @type {ComponentData} */
  const json = await yaml.load(await readFile(componentDataPath, 'utf8'), { json: true })

  if (!json?.examples) {
    throw new Error(`${componentDataPath} is missing "examples"`)
  }

  // Nunjucks template
  const template = join(dirname(componentDataPath), 'template.njk')
  const componentName = basename(dirname(componentDataPath))

  // Loop examples
  const examples = json.examples.map(async (example) => {
    const context = { params: example.data }

    return {
      name: example.name,
      options: example.data,
      hidden: Boolean(example.hidden),

      // Wait for render to complete
      /** @type {string} */
      html: await new Promise((resolve, reject) => {
        return nunjucks.render(template, context, (error, result) => {
          return error ? reject(error) : resolve(result?.trim() ?? '')
        })
      })
    }
  })

  return {
    component: componentName,
    fixtures: await Promise.all(examples)
  }
}

/**
 * Macro options YAML to JSON
 *
 * @param {string} componentDataPath - Path to ${componentName}.yaml
 * @returns {Promise<ComponentOption[] | undefined>} Component macro options
 */
async function generateMacroOption (componentDataPath) {
  /** @type {ComponentData} */
  const json = await yaml.load(await readFile(componentDataPath, 'utf8'), { json: true })

  if (!json?.params) {
    throw new Error(`${componentDataPath} is missing "params"`)
  }

  return json.params
}

/**
 * @typedef {import('./assets.mjs').AssetEntry} AssetEntry
 * @typedef {import('govuk-frontend-lib/files').ComponentData} ComponentData
 * @typedef {import('govuk-frontend-lib/files').ComponentOption} ComponentOption
 */
