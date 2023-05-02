import { join } from 'path'

import { paths } from 'govuk-frontend-config'
import { filterPath, getDirectories, getListing } from 'govuk-frontend-lib/files'
import { componentNameToMacroName } from 'govuk-frontend-lib/names'
import slash from 'slash'

/**
 * GOV.UK Prototype Kit config builder
 *
 * @returns {Promise<PrototypeKitConfig>} GOV.UK Prototype Kit config
 */
export default async () => {
  const componentsFiles = await getListing(join(paths.src, 'govuk/components'))
  const componentNames = await getDirectories(join(paths.src, 'govuk/components'))

  // Build array of macros
  const nunjucksMacros = componentNames
    .map((componentName) => {
      const [macroPath] = componentsFiles
        .filter(filterPath([`**/${componentName}/macro.njk`]))

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

/**
 * GOV.UK Prototype Kit config
 *
 * @typedef {object} PrototypeKitConfig
 * @property {string[]} assets - Static asset paths
 * @property {string[]} sass - Sass stylesheets to compile
 * @property {string[] | { path: string, type?: string }[]} scripts - JavaScripts to serve
 * @property {{ importFrom: string, macroName: string }[]} nunjucksMacros - Nunjucks macros to include
 * @property {string[]} nunjucksPaths - Nunjucks paths
 */
