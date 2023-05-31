import { join, parse } from 'path'

import { paths } from 'govuk-frontend-config'
import { getComponentNames, filterPath, getYaml } from 'govuk-frontend-lib/files'

/**
 * Components with JavaScript
 */
const componentNamesWithJavaScript = await getComponentNames((componentName, componentFiles) =>
  componentFiles.some(filterPath([`**/${componentName}.mjs`])))

/**
 * Rollup input paths
 */
export const modulePaths = ['all.mjs']
  .concat(componentNamesWithJavaScript.map((componentName) =>
    `components/${componentName}/${componentName}.mjs`))

/**
 * Rollup module stats
 *
 * @param {string} modulePath - Rollup input path
 * @returns {Promise<{ total: number, modules: ModulesList }>} Rollup module stats
 */
export async function getStats (modulePath) {
  const { base, dir, name } = parse(modulePath)

  // Path to Rollup `npm run build` YAML stats
  /** @type {Record<string, ModulesList> | undefined} */
  const stats = await getYaml(join(paths.stats, `dist/${dir}/${name}.yaml`))
    .catch(() => undefined)

  // Modules bundled
  const modules = stats?.[base] ?? {}

  // Modules total size
  const total = Object.values(modules)
    .map(({ rendered }) => rendered)
    .reduce((total, rendered) => total + rendered, 0)

  return { total, modules }
}

/**
 * @typedef {{ [modulePath: string]: { rendered: number } }} ModulesList
 */
