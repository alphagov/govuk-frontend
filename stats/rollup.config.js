const { resolve } = require('node:path')

const { nodeResolve } = require('@rollup/plugin-node-resolve')
const virtual = require('@rollup/plugin-virtual')
const visualizer = require('rollup-plugin-visualizer')

module.exports = {
  // We point rollup to a virtual entry which we can configure to load the files we want to run stats on
  input: 'entry',
  plugins: [
    nodeResolve(),
    virtual({
      // We need to `export` to ensure rollup doesn't treeshake all imports, as our virtual module doesn't use anything
      // For `dist` we could just `import` the dist file
      entry: `export {Accordion} from '${resolve(__dirname, '../package/govuk-esm/all.mjs')}';`
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
          filename: `../public/stats-${template}.${extension}`,
          title: `"${template}" stats for GOV.UK Frontend`,
          template
        })
      }
    )
  ]
}
