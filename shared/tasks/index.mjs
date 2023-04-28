/**
 * Shared tasks
 */
export * as assets from './assets.mjs'
export * as browser from './browser.mjs'
export * as components from './components.mjs'
export * as configs from './configs.mjs'
export * as files from './files.mjs'
export * as npm from './npm.mjs'
export * as scripts from './scripts.mjs'
export * as styles from './styles.mjs'
export * as task from './task.mjs'

/**
 * Types for tasks
 *
 * @typedef {Required<import('./assets.mjs').AssetPathOptions>} TaskOptions
 * @typedef {(options: TaskOptions) => import('gulp').TaskFunction} TaskFunction
 */
