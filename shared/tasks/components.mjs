import { join } from 'path'

import { paths } from '@govuk-frontend/config'
import {
  nunjucksEnv,
  getComponentData,
  getComponentNames,
  render
} from '@govuk-frontend/lib/components'
import slug from 'slug'

import { files } from './index.mjs'

/**
 * Generate fixtures.json from component data
 *
 * @param {Pick<AssetEntry[1], "srcPath" | "destPath">} options - Asset options
 */
export async function generateFixtures({ srcPath, destPath }) {
  const componentNames = await getComponentNames()

  // Loop component names
  const fixtures = componentNames.map(async (componentName) => {
    const fixture = await generateFixture(componentName, { srcPath })

    // Write fixtures.json to destination
    await files.write(join(componentName, 'fixtures.json'), {
      destPath,

      // Add fixtures as JSON (formatted)
      async fileContents() {
        return JSON.stringify(fixture, null, 4)
      }
    })
  })

  if (!fixtures.length) {
    throw new Error('No fixtures to write')
  }

  await Promise.all(fixtures)
}

/**
 * Generate macro-options.json from component data
 *
 * @param {Pick<AssetEntry[1], "destPath">} options - Asset options
 */
export async function generateMacroOptions({ destPath }) {
  const componentNames = await getComponentNames()

  /**
   * Convert params object to macro options array
   *
   * @param {ComponentData["params"]} [params] - Params object with name keys
   * @returns {MacroOptionFixture["params"] | undefined} Params array of objects
   */
  function paramsToMacroOptions(params) {
    if (!params) {
      return
    }

    return Object.entries(params).map(([name, param]) => ({
      name,
      ...param,
      params: paramsToMacroOptions(param.params)
    }))
  }

  // Loop component names
  const macroOptions = componentNames.map(async (componentName) => {
    const { params } = await getComponentData(componentName)

    // Write macro-options.json to destination
    await files.write(join(componentName, 'macro-options.json'), {
      destPath,

      // Add macro options as JSON (formatted)
      async fileContents() {
        return JSON.stringify(paramsToMacroOptions(params), null, 4)
      }
    })
  })

  if (!macroOptions.length) {
    throw new Error('No macro options to write')
  }

  await Promise.all(macroOptions)
}

/**
 * Component fixtures to JSON
 *
 * @param {string} componentName - Component name
 * @param {Pick<AssetEntry[1], "srcPath">} options - Asset options
 * @returns {Promise<ComponentFixtures>} Component fixtures object
 */
async function generateFixture(componentName, options) {
  const componentData = await getComponentData(componentName)

  // Nunjucks environment
  const env = nunjucksEnv([options.srcPath])

  // Loop examples
  const fixtures = componentData.examples.map(
    /**
     * @param {ComponentExample} example - Component example
     * @returns {Promise<ComponentFixture>} Component fixture
     */
    async (example) => {
      // Render Nunjucks example
      const html = render(componentName, {
        context: example.options,
        env
      })

      // Write rendered Nunjucks example for diff
      if (!example.hidden) {
        await files.write(`template-${slug(example.name)}.html`, {
          destPath: join(paths.package, `dist/govuk/components`, componentName),
          fileContents: async () => html.trimEnd()
        })
      }

      return {
        name: example.name,
        options: example.options,
        hidden: Boolean(example.hidden),

        // Add defaults to optional fields
        description: example.description ?? '',
        previewLayoutModifiers: example.previewLayoutModifiers ?? [],

        // Add rendered Nunjucks example to fixture
        html: html.trim()
      }
    }
  )

  return {
    component: componentName,
    fixtures: await Promise.all(fixtures),
    previewLayout: componentData.previewLayout
  }
}

/**
 * @typedef {import('./assets.mjs').AssetEntry} AssetEntry
 * @typedef {import('@govuk-frontend/lib/components').ComponentData} ComponentData
 * @typedef {import('@govuk-frontend/lib/components').ComponentOption} ComponentOption
 * @typedef {import('@govuk-frontend/lib/components').ComponentExample} ComponentExample
 * @typedef {import('@govuk-frontend/lib/components').ComponentFixture} ComponentFixture
 * @typedef {import('@govuk-frontend/lib/components').ComponentFixtures} ComponentFixtures
 */

/**
 * Macro options fixture with params as arrays
 * (used by the Design System website)
 *
 * @typedef {Omit<ComponentData, 'params'> & { name: string, params: MacroOptionNestedFixture[] }} MacroOptionFixture
 * @typedef {Omit<ComponentOption, 'params'> & { name: string, params?: MacroOptionNestedFixture[] }} MacroOptionNestedFixture
 */
