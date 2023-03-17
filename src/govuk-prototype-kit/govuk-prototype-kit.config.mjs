import { join } from 'path'

import slash from 'slash'

import configPaths from '../../config/paths.js'
import { filterPath, getDirectories, getListing } from '../../lib/file-helper.js'
import { componentNameToMacroName } from '../../lib/helper-functions.js'

/**
 * GOV.UK Prototype Kit config builder
 */
export default async () => {
  const componentsFiles = await getListing(join(configPaths.src, 'govuk/components'))
  const componentNames = await getDirectories(join(configPaths.src, 'govuk/components'))

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
