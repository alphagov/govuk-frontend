import { join } from 'path'

import { paths } from 'govuk-frontend-config'
import helpers from 'govuk-frontend-helpers'
import slash from 'slash'

const { filterPath, getDirectories, getListing } = helpers.files
const { componentNameToMacroName } = helpers.names

/**
 * GOV.UK Prototype Kit config builder
 */
export default async () => {
  const componentsFiles = await getListing(join(paths.src, 'govuk/components'))
  const componentNames = await getDirectories(join(paths.src, 'govuk/components'))

  // Build array of macros
  const nunjucksMacros = componentNames
    .map((componentName) => {
      const [macroPath] = componentsFiles
        .filter(filterPath([`${componentName}/macro.njk`]))

      return {
        importFrom: slash(join('govuk/components', macroPath)),
        macroName: componentNameToMacroName(componentName)
      }
    })

  return {
    assets: [
      '/govuk/assets',
      '/govuk/all.js.map'
    ],
    sass: [
      '/govuk-prototype-kit/init.scss'
    ],
    scripts: [
      '/govuk/all.js',
      '/govuk-prototype-kit/init.js'
    ],
    nunjucksMacros,
    nunjucksPaths: ['/']
  }
}
