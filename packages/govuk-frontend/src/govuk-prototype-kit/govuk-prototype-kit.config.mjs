import { join } from 'path'

import { filterPath, getComponentNames, getListing } from 'govuk-frontend-lib/files'
import { componentNameToMacroName, packageNameToPath } from 'govuk-frontend-lib/names'
import slash from 'slash'

/**
 * GOV.UK Prototype Kit config builder
 *
 * @returns {Promise<PrototypeKitConfig>} GOV.UK Prototype Kit config
 */
export default async () => {
  const srcPath = join(packageNameToPath('govuk-frontend'), 'src')

  // Locate component macros
  const componentMacros = await getListing('**/components/**/macro.njk', { cwd: srcPath })
  const componentNames = await getComponentNames()

  // Build array of macros
  const nunjucksMacros = componentNames
    .map((componentName) => {
      const [macroPath = ''] = componentMacros
        .filter(filterPath([`**/${componentName}/macro.njk`]))

      return {
        importFrom: slash(macroPath),
        macroName: componentNameToMacroName(componentName)
      }
    })

  return {
    assets: [
      '/dist/govuk/assets',
      '/dist/govuk/all.bundle.js.map'
    ],
    sass: [
      '/dist/govuk-prototype-kit/init.scss'
    ],
    scripts: [
      '/dist/govuk/all.bundle.js',
      '/dist/govuk-prototype-kit/init.js'
    ],
    nunjucksMacros,
    nunjucksPaths: ['/dist']
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
