import chokidar from 'chokidar'
import gulp from 'gulp'
import slash from 'slash'

import { paths } from '../../config/index.js'
import { npm } from '../../tasks/index.mjs'

import { scripts, styles } from './index.mjs'

/**
 * Watch task
 * During development, this task will:
 * - lint and run `gulp styles` when `.scss` files change
 * - lint and run `gulp scripts` when `.mjs` files change
 *
 * @returns {Promise<import('chokidar').FSWatcher[]>} Array from file system watcher objects
 */
export function watch () {
  const ignored = [`${slash(paths.src)}/govuk/vendor/*`]

  return Promise.all([
    onEvent([
      `${slash(paths.root)}/sassdoc.config.yaml`,
      `${slash(paths.app)}/src/**/*.scss`,
      `${slash(paths.src)}/govuk/**/*.scss`
    ], { ignored, ignoreInitial: true }, gulp.parallel(
      npm.script('lint:scss'),
      styles
    )),

    onEvent([
      `${slash(paths.root)}/jsdoc.config.js`,
      `${slash(paths.src)}/govuk/**/*.mjs`
    ], { ignored, ignoreInitial: true }, gulp.parallel(
      npm.script('lint:js'),
      scripts
    ))
  ])
}

/**
 * Listen for watch events
 *
 * @param {string[]} paths - Paths to watch
 * @param {import('chokidar').WatchOptions} options
 * @param {import('gulp').TaskFunction} taskFn - Task function
 * @returns {import('chokidar').FSWatcher} File system watcher
 */
function onEvent (paths, options, taskFn) {
  let running = false
  let timeoutId

  // Add watcher for file paths
  const watcher = chokidar.watch(paths, options)

  // 1. Task runs wait 200ms for multiple events
  function debounce () {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(throttle, 200)
  }

  // 2. Task runs are ignored when running
  function throttle () {
    if (running) {
      return
    }

    running = true
    taskFn(complete)
  }

  // 3. Task runs can resume when complete
  function complete () {
    running = false
  }

  // Respond to files added, changed or deleted
  for (const event of ['add', 'change', 'unlink']) {
    watcher.on(event, debounce)
  }

  return watcher
}
