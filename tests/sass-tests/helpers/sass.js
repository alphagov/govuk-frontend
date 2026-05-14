const { paths } = require('@govuk-frontend/config')
const { compileSassString } = require('@govuk-frontend/helpers/tests')
const { NodePackageImporter } = require('sass-embedded')

/** @type {import('sass-embedded').StringOptions<"async">} */
const sassConfig = {
  loadPaths: [paths.root, __dirname],
  quietDeps: true,
  silenceDeprecations: ['import', 'mixed-decls'],
  importers: [new NodePackageImporter()]
}

async function compileSassStringLikeUsers(string, options = sassConfig) {
  const { css } = await compileSassString(string, options)
  return css.replaceAll(/\n+/g, '\n')
}

module.exports = {
  sassConfig,
  compileSassStringLikeUsers
}
