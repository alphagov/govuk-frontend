import { join, parse } from 'path'

import { paths } from '@govuk-frontend/config'
import { getComponentNamesFiltered } from '@govuk-frontend/lib/components'
import { filterPath, getYaml } from '@govuk-frontend/lib/files'
import { filesize } from 'filesize'

/**
 * Components with JavaScript
 */
const componentNamesWithJavaScript = await getComponentNamesFiltered(
  (componentName, componentFiles) =>
    componentFiles.some(filterPath([`**/${componentName}.mjs`])),
  { moduleRoot: paths.stats }
)

/**
 * Package options
 *
 * @satisfies {import('@govuk-frontend/lib/names').PackageOptions}
 */
export const packageOptions = {
  type: 'module',
  modulePath: 'all.mjs',
  moduleRoot: paths.stats
}

/**
 * Rollup input paths
 */
export const modulePaths = [packageOptions.modulePath].concat(
  componentNamesWithJavaScript.map(
    (componentName) => `components/${componentName}/${componentName}.mjs`
  )
)

/**
 * Rollup module stats by path
 *
 * @param {string} modulePath - Rollup input path
 * @returns {Promise<[string, { bundled: string; minified: string }]>} Rollup module stats
 */
export async function getStats(modulePath) {
  const { dir, name } = parse(modulePath)

  // Totals from Rollup `npm run build:stats` YAML output
  const [bundled, minified] = await Promise.all([
    getStatsByYaml(modulePath, `${dir}/${name}.yaml`),
    getStatsByYaml(modulePath, `${dir}/${name}.min.yaml`)
  ])

  return [modulePath, { bundled, minified }]
}

/**
 * Rollup module stats by YAML path
 *
 * @param {string} modulePath - Rollup input path
 * @param {string} statsPath - Rollup stats output path
 * @returns {Promise<string>} Total size (formatted)
 */
async function getStatsByYaml(modulePath, statsPath) {
  const { base } = parse(modulePath)

  const stats = /** @type {Record<string, ModulesList> | undefined} */ (
    await getYaml(join(paths.stats, `dist/${statsPath}`)).catch(() => undefined)
  )

  // Modules total size
  const total = Object.values(stats?.[base] ?? {})
    .map(({ rendered }) => rendered)
    .reduce((total, rendered) => total + rendered, 0)

  return `${filesize(total, { base: 2 })}`
}

/**
 * @typedef {{ [modulePath: string]: { rendered: number } }} ModulesList
 */
