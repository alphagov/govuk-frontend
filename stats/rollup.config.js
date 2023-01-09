const { join, resolve } = require('node:path')

const { nodeResolve } = require('@rollup/plugin-node-resolve')
const virtual = require('@rollup/plugin-virtual')
const visualizer = require('rollup-plugin-visualizer')

/**
 * Lists the files to analyse in a `name` => `options` map,
 * where `options` is an array that contains:
 *
 * 1. the path to import (mandatory)
 * 2. the name of the import (optional, if missing will consider that you're trying to import `default`)
 *
 * @type {Object<string,Array<string>>}
 */
const TO_ANALYSE = {
  all: ['all.mjs', '*'],
  'all-accordion': ['all.mjs', '{Accordion}'],
  'component-accordion': ['components/accordion/accordion.mjs']
}

const ESM_ROOT = resolve(__dirname, '../package/govuk-esm')

// Little workaround to be able to re-export the default export
// https://stackoverflow.com/a/39999593
const DEFAULT_EXPORT = '{default as Imported}'

module.exports = Object.entries(TO_ANALYSE).map(function ([analysisName, options]) {
  const [path, toExport] = options

  return {
    // We point rollup to a virtual entry which we can configure to load the files we want to run stats on
    input: 'entry',
    plugins: [
      nodeResolve(),
      virtual({
        // We need to `export` to ensure rollup doesn't treeshake all imports, as our virtual module doesn't use anything
        // For `dist` we could just `import` the dist file
        entry: `export ${toExport || DEFAULT_EXPORT} from '${join(ESM_ROOT, path)}';`
      }),
      // This is only for example, we would likely only run a single kind of export (JSON), maybe 2 (JSON+HTML)
      ...['sunburst', 'treemap', 'network', 'raw-data', 'list'].map(
        (template) => {
          const extension =
            template === 'raw-data'
              ? 'json'
              : template === 'list'
                ? 'txt'
                : 'html'

          return visualizer.default({
            filename: join(__dirname, `public/${analysisName}/stats-${template}.${extension}`),
            title: `"${template}" stats for GOV.UK Frontend`,
            template
          })
        }
      )
    ]
  }
})
