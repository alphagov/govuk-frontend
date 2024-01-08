import { basename, dirname, join } from 'path'
import { inspect } from 'util'

import { paths } from '@govuk-frontend/config'
import { nunjucksEnv, render } from '@govuk-frontend/lib/components'
import { getListing, getYaml } from '@govuk-frontend/lib/files'
import { outdent } from 'outdent'
import { format } from 'prettier'
import slug from 'slug'

import { files } from './index.mjs'

/**
 * Generate fixtures.json from component data
 *
 * @param {AssetEntry[0]} pattern - Path to ${componentName}.yaml
 * @param {Pick<AssetEntry[1], "srcPath" | "destPath">} options - Asset options
 */
export async function generateFixtures(pattern, { srcPath, destPath }) {
  const componentDataPaths = await getListing(pattern, {
    cwd: srcPath
  })

  // Loop component data paths
  const fixtures = componentDataPaths.map(async (componentDataPath) => {
    const fixture = await generateFixture(componentDataPath, { srcPath })

    // Write to destination
    await files.write(componentDataPath, {
      destPath,

      // Rename to fixtures.json
      filePath({ dir }) {
        return join(dir, 'fixtures.json')
      },

      // Add fixtures as JSON (formatted)
      async fileContents() {
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
 * @param {Pick<AssetEntry[1], "srcPath" | "destPath">} options - Asset options
 */
export async function generateMacroOptions(pattern, { srcPath, destPath }) {
  const componentDataPaths = await getListing(pattern, {
    cwd: srcPath
  })

  // Loop component data paths
  const macroOptions = componentDataPaths.map(async (componentDataPath) => {
    const macroOption = await generateMacroOption(componentDataPath, {
      srcPath
    })

    // Write to destination
    await files.write(componentDataPath, {
      destPath,

      // Rename to 'macro-options.json'
      filePath({ dir }) {
        return join(dir, 'macro-options.json')
      },

      // Add macro options as JSON (formatted)
      async fileContents() {
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
 * @param {Pick<AssetEntry[1], "srcPath">} options - Asset options
 * @returns {Promise<ComponentFixtures>} Component fixtures object
 */
async function generateFixture(componentDataPath, options) {
  /** @type {ComponentData} */
  const json = await getYaml(join(options.srcPath, componentDataPath))

  if (!json?.examples) {
    throw new Error(`${componentDataPath} is missing "examples"`)
  }

  // Nunjucks environment
  const env = nunjucksEnv([options.srcPath])

  // Nunjucks template
  const componentName = basename(dirname(componentDataPath))

  // Loop examples
  const fixtures = json.examples.map(
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
    previewLayout: json.previewLayout
  }
}

/**
 * Macro options YAML to JSON
 *
 * @param {string} componentDataPath - Path to ${componentName}.yaml
 * @param {Pick<AssetEntry[1], "srcPath">} options - Asset options
 * @returns {Promise<ComponentOption[] | undefined>} Component macro options
 */
async function generateMacroOption(componentDataPath, options) {
  /** @type {ComponentData} */
  const json = await getYaml(join(options.srcPath, componentDataPath))

  if (!json?.params) {
    throw new Error(`${componentDataPath} is missing "params"`)
  }

  // Generate component options/data.mjs
  await files.write(componentDataPath, {
    destPath: options.srcPath,

    filePath({ dir }) {
      return join(dir, 'options', 'data.mjs')
    },

    async fileContents() {
      const accessibilityCriteria = (json.accessibilityCriteria ?? '')
        .replaceAll('`', '\\`')
        .replaceAll(/\n(?!\n)/g, '\n    ')
        .trim()

      return (
        await format(
          outdent`
            ${
              json.accessibilityCriteria
                ? "import { outdent } from 'outdent'"
                : ''
            }

            import { examples } from './examples.mjs'
            import { params } from './params.mjs'

            /**
             * Component data
             *
             * @satisfies {import('@govuk-frontend/lib/components').ComponentData}
             */
            export default {
              params,
              examples,${
                json.previewLayout
                  ? `\npreviewLayout: '${json.previewLayout}',`
                  : ''
              }
              ${
                json.accessibilityCriteria
                  ? `accessibilityCriteria: outdent\`\n    ${accessibilityCriteria}\n  \``
                  : ''
              }
            }
          `,
          {
            parser: 'espree',
            semi: false,
            singleQuote: true,
            trailingComma: 'none'
          }
        )
      ).trim()
    }
  })

  // Generate component options/examples.mjs
  await files.write(componentDataPath, {
    destPath: options.srcPath,

    filePath({ dir }) {
      return join(dir, 'options', 'examples.mjs')
    },

    async fileContents() {
      const inspectOptions = {
        compact: false,
        depth: Infinity,
        maxArrayLength: Infinity,
        maxStringLength: Infinity
      }

      return (
        await format(
          outdent`
            /**
             * Component examples with Nunjucks macro options (or params)
             *
             * @satisfies {import('@govuk-frontend/lib/components').ComponentExample[]}
             */
            export const examples = ${inspect(json.examples, inspectOptions)}
          `,
          {
            parser: 'espree',
            semi: false,
            singleQuote: true,
            trailingComma: 'none'
          }
        )
      ).trim()
    }
  })

  /**
   * Convert params array to object with name keys
   *
   * @param {ComponentOption[]} params - Params array of objects
   * @returns {{ [param: string]: ComponentOptionAsObject }} Params object with name keys
   */
  function paramsToObject(params) {
    const paramsToObjectEntries = params.map(({ params, ...param }) => {
      /** @type {ComponentOptionAsObject} */
      const paramToObject = param

      if (params) {
        paramToObject.params = paramsToObject(params)
      }

      return paramToObject
    })

    const paramsByNameEntries = new Map(
      paramsToObjectEntries.map(({ name, ...param }) => [name, param])
    )

    // Convert dot-separated 'heading.text' etc to nested params
    for (const [key, param] of paramsByNameEntries) {
      const names = key.split('.')

      if (!names[1]) {
        // eslint-disable-next-line no-continue
        continue
      }

      // Split 'heading.text' etc
      const group = names[0] // heading
      const name = names[1] // text

      // Add new nested param `text` etc for 'heading'
      if (paramsByNameEntries.has(group)) {
        paramsByNameEntries.get(group).params[name] = param
        // eslint-disable-next-line no-continue
        continue
      }

      // Otherwise create new entry for 'heading' first
      paramsByNameEntries.set(group, {
        type: 'object',
        required: true,
        description: 'TODO',
        params: { [name]: param }
      })
    }

    // Remove legacy dot-separated 'heading.text' entries
    for (const [key] of paramsByNameEntries) {
      const name = key.split('.')[1]

      if (name) {
        paramsByNameEntries.delete(key)
      }
    }

    return Object.fromEntries(paramsByNameEntries)
  }

  // Generate component options/params.mjs
  await files.write(componentDataPath, {
    destPath: options.srcPath,

    filePath({ dir }) {
      return join(dir, 'options', 'params.mjs')
    },

    async fileContents() {
      const inspectOptions = {
        compact: false,
        depth: Infinity,
        maxArrayLength: Infinity,
        maxStringLength: Infinity
      }

      return (
        await format(
          outdent`
            /**
             * Nunjucks macro option (or param) configs
             *
             * @satisfies {{ [param: string]: import('@govuk-frontend/lib/components').ComponentOption }}
             */
            export const params = ${inspect(
              paramsToObject(json.params),
              inspectOptions
            )}
          `,
          {
            parser: 'espree',
            semi: false,
            singleQuote: true,
            trailingComma: 'none'
          }
        )
      ).trim()
    }
  })

  return json.params
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
 * Component option converted to object
 *
 * @typedef {object} ComponentOptionAsObject
 * @property {string} [name] - Option name
 * @property {string} type - Option type
 * @property {boolean} required - Option required
 * @property {string} description - Option description
 * @property {boolean} [isComponent] - Option is another component
 * @property {{ [param: string]: ComponentOptionAsObject }} [params] - Nested Nunjucks macro options
 */
