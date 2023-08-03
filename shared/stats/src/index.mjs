import { stat } from 'fs/promises'
import { join, parse } from 'path'

import { paths, pkg } from '@govuk-frontend/config'
import { getComponentNamesFiltered } from '@govuk-frontend/lib/components'
import { filterPath, getYaml } from '@govuk-frontend/lib/files'

/**
 * Components with JavaScript
 */
const componentNamesWithJavaScript = await getComponentNamesFiltered(
  (componentName, componentFiles) =>
    componentFiles.some(filterPath([`**/${componentName}.mjs`])),
  { moduleRoot: paths.stats }
)

/**
 * Target files for file size analysis
 */
const filesForAnalysis = [
  `dist/govuk-frontend-${pkg.version}.min.js`,
  `dist/govuk-frontend-${pkg.version}.min.css`,
  'packages/govuk-frontend/dist/govuk/all.mjs',
  'packages/govuk-frontend/dist/govuk/all.bundle.mjs',
  'packages/govuk-frontend/dist/govuk/all.bundle.js'
]

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
 * Rollup module stats
 *
 * @param {string} modulePath - Rollup input path
 * @returns {Promise<{ total: number, modules: ModulesList, moduleCount: number }>} Rollup module stats
 */
export async function getStats(modulePath) {
  const { base, dir, name } = parse(modulePath)

  // Path to Rollup `npm run build` YAML stats
  /** @type {Record<string, ModulesList> | undefined} */
  const stats = await getYaml(
    join(paths.stats, `dist/${dir}/${name}.yaml`)
  ).catch(() => undefined)

  // Modules bundled
  const modules = stats?.[base] ?? {}

  const moduleCount = Object.keys(modules).length

  // Modules total size
  const total = Object.values(modules)
    .map(({ rendered }) => rendered)
    .reduce((total, rendered) => total + rendered, 0)

  return { total, modules, moduleCount }
}

/**
 * Returns file sizes of key files
 *
 * @returns {Promise<{[key: string]: import('fs').Stats}>} - File names and size
 */
export async function getFileSizes() {
  /** @type { { [key: string]: import('fs').Stats } } */
  const result = {}

  for (const filename of filesForAnalysis) {
    const stats = await stat(join(paths.root, filename))
    result[filename] = stats
  }

  return result
}

/**
 * @typedef {{ [modulePath: string]: { rendered: number } }} ModulesList
 */
