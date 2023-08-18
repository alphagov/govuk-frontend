import { join } from 'path'

import { getComponentNames } from '@govuk-frontend/lib/components'
import { filterPath, getListing } from '@govuk-frontend/lib/files'
import {
  componentNameToMacroName,
  packageNameToPath
} from '@govuk-frontend/lib/names'
import slash from 'slash'

/**
 * GOV.UK Prototype Kit config builder
 *
 * @returns {Promise<PrototypeKitConfig>} GOV.UK Prototype Kit config
 */
export default async () => {
  const srcPath = join(packageNameToPath('govuk-frontend'), 'src')

  // Locate component macros
  const componentMacros = await getListing('**/components/**/macro.njk', {
    cwd: srcPath
  })
  const componentNames = await getComponentNames()

  // Build array of macros
  const nunjucksMacros = componentNames.map((componentName) => {
    const [macroPath = ''] = componentMacros.filter(
      filterPath([`**/${componentName}/macro.njk`])
    )

    return {
      importFrom: slash(macroPath),
      macroName: componentNameToMacroName(componentName)
    }
  })

  return {
    meta: {
      description:
        'GOV.UK Frontend contains the code you need to start building a user interface for government platforms and services.',
      urls: {
        documentation: 'https://design-system.service.gov.uk/',
        releaseNotes:
          'https://github.com/alphagov/govuk-frontend/releases/tag/v{{version}}',
        versionHistory: 'https://github.com/alphagov/govuk-frontend/releases'
      }
    },
    assets: ['/dist/govuk/assets', '/dist/govuk/all.bundle.js.map'],
    sass: ['/dist/govuk-prototype-kit/init.scss'],
    scripts: ['/dist/govuk/all.bundle.js', '/dist/govuk-prototype-kit/init.js'],
    nunjucksMacros,
    nunjucksPaths: ['/dist']
  }
}

/**
 * GOV.UK Prototype Kit config
 *
 * @typedef {object} PrototypeKitConfig
 * @property {object} meta - metadata about the plugin
 * @property {string[]} assets - Static asset paths
 * @property {string[]} sass - Sass stylesheets to compile
 * @property {string[] | { path: string, type?: string }[]} scripts - JavaScripts to serve
 * @property {{ importFrom: string, macroName: string }[]} nunjucksMacros - Nunjucks macros to include
 * @property {string[]} nunjucksPaths - Nunjucks paths
 */
