import { join, parse } from 'path'

import { paths } from '@govuk-frontend/config'
import { getComponentNamesFiltered } from '@govuk-frontend/lib/components'
import { filterPath, getFileSizes, getYaml } from '@govuk-frontend/lib/files'
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
 * Get both bundled and minified module file sizes
 *
 * @returns {Promise<FileSize[]>} Array of file size objects
 */
export async function getModuleFileSizes() {
  return [
    ...(await Promise.all(
      modulePaths.map((path) => getStatsByYaml(path, 'bundled'))
    )),
    ...(await Promise.all(
      modulePaths.map((path) => getStatsByYaml(path, 'minified'))
    ))
  ]
}

/**
 * Get all distributed file sizes
 *
 * @param {string} path - Root path of project to retrieve files from
 * @returns {Promise<FileSize[]>} Array of file size objects
 */
export async function getAllFileSizes(path) {
  return [
    ...(await getFileSizes(join(join(path, 'dist'), '**/*.{css,js,mjs}'))),
    ...(await getFileSizes(
      join(join(path, 'packages/govuk-frontend/dist/govuk'), '*.{css,js,mjs}')
    ))
  ]
}

/**
 * @typedef {{ [modulePath: string]: { rendered: number } }} ModulesList
 */

/**
 * @typedef {object} FileSize
 * @property {string} path - File path
 * @property {number|string} size - File size, as a raw number or human-readable string
 * @property {('bundled'|'minified')} [type] - Type of file size. Only used by module sizes
 */
