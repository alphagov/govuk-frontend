import { join } from 'path'

import { pkg } from '@govuk-frontend/config'
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

  // GitHub URL without `.git` suffix
  const { href } = new URL(pkg.repository.url)
  const githubURL = new URL(href.replace(/^git\+/, '').replace(/\.git$/, ''))

  // Locate component names and macros
  const componentNames = await getComponentNames()
  const componentMacros = await getListing('**/components/**/macro.njk', {
    cwd: srcPath
  })

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
      description: pkg.description,
      urls: {
        documentation: 'https://design-system.service.gov.uk/',
        releaseNotes: `${githubURL.href}/releases/tag/v${pkg.version}`,
        versionHistory: `${githubURL.href}/releases`
      }
    },
    assets: ['/dist/govuk/assets', '/dist/govuk/govuk-frontend.min.js.map'],
    sass: ['/dist/govuk-prototype-kit/init.scss'],
    scripts: [
      {
        path: '/dist/govuk/govuk-frontend.min.js',
        type: 'module'
      },
      {
        path: '/dist/govuk-prototype-kit/init.js',
        type: 'module'
      }
    ],
    nunjucksMacros,
    nunjucksPaths: ['/dist']
  }
}

/**
 * GOV.UK Prototype Kit plugin config
 *
 * @typedef {object} PrototypeKitConfig
 * @property {PrototypeKitConfigMeta} meta - metadata about the plugin
 * @property {string[]} assets - Static asset paths
 * @property {string[]} sass - Sass stylesheets to compile
 * @property {string[] | { path: string, type?: string }[]} scripts - JavaScripts to serve
 * @property {{ importFrom: string, macroName: string }[]} nunjucksMacros - Nunjucks macros to include
 * @property {string[]} nunjucksPaths - Nunjucks paths
 */

/**
 * GOV.UK Prototype Kit plugin metadata
 *
 * @typedef {object} PrototypeKitConfigMeta
 * @property {string} description - Plugin description
 * @property {PrototypeKitConfigURLs} urls - Plugin URLs
 */

/**
 * GOV.UK Prototype Kit plugin URLs
 *
 * @typedef {object} PrototypeKitConfigURLs
 * @property {string} documentation - Documentation URL
 * @property {string} releaseNotes - Release notes URL
 * @property {string} versionHistory - Version history URL
 */
