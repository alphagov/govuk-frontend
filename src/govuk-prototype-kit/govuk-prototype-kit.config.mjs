import { join, relative } from 'path'
import slash from 'slash'

import { filterPath, getDirectories, getListing } from '../../lib/file-helper.js'
import { componentNameToMacroName } from '../../lib/helper-functions.js'
import configPaths from '../../config/paths.js'

/**
 * GOV.UK Prototype Kit config builder
 */
export default async () => {
  const componentsFiles = await getListing(configPaths.components)
  const componentNames = await getDirectories(configPaths.components)

  // Build array of macros
  const nunjucksMacros = componentNames
    .map((componentName) => {
      const [macroPath] = componentsFiles
        .filter(filterPath([`${componentName}/macro.njk`]))

      return {
        importFrom: slash(relative(configPaths.src, join(configPaths.components, macroPath))),
        macroName: componentNameToMacroName(componentName)
      }
    })

  return {
    assets: [
      '/govuk/assets'
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
