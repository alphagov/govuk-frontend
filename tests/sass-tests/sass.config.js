const { paths } = require('@govuk-frontend/config')
const { NodePackageImporter } = require('sass-embedded')

/** @type {import('sass-embedded').StringOptions<"async">} */
const sassConfig = {
  loadPaths: [paths.root, __dirname],
  quietDeps: true,
  silenceDeprecations: ['import', 'mixed-decls'],
  importers: [new NodePackageImporter()]
}

module.exports = {
  sassConfig
}
