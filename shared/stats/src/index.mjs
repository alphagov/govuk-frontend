import { join, parse } from 'path'

import { paths } from '@govuk-frontend/config'
import { getComponentNamesFiltered } from '@govuk-frontend/lib/components'
import { filterPath, getFileSizes, getYaml } from '@govuk-frontend/lib/files'

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
 * Rollup module stats by YAML path
 *
 * @param {string} modulePath - Rollup input path
 * @param {('bundled'|'minified')} type - Rollup stats output path
 * @returns {Promise<FileSize>} Total size (formatted)
 */
async function getStatsByYaml(modulePath, type) {
  const { base, dir, name } = parse(modulePath)
  const statsPath = `${dir}/${name}${type === 'minified' ? '.min' : ''}.yaml`
  const stats = /** @type {Record<string, ModulesList> | undefined} */ (
    await getYaml(join(paths.stats, `dist/${statsPath}`)).catch(() => undefined)
  )

  // Modules total size
  const size = Object.values(stats?.[base] ?? {})
    .map(({ rendered }) => rendered)
    .reduce((total, rendered) => total + rendered, 0)

  return {
    path: modulePath,
    size,
    type
  }
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
 * @import {FileSize} from '@govuk-frontend/lib/files'
 */
