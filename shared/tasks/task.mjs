/**
 * Creates a Gulp task with display name
 *
 * {@link https://gulpjs.com/docs/en/api/task#task-metadata}
 *
 * @template {import('gulp').TaskFunction} TaskFunction
 * @param {string} displayName - Task name for Gulp CLI
 * @param {TaskFunction} taskFn - Task function to wrap
 * @returns {TaskFunction} Script run
 */
export function create(displayName, taskFn) {
  taskFn.displayName = displayName
  return taskFn
}

/**
 * Creates a Gulp task that logs errors instead of failing
 *
 * For example, to stop linting errors from ending `gulp watch`
 *
 * @param {(() => Promise<void>) & { displayName?: string }} taskFn - Task function to wrap
 * @returns {() => Promise<void>} Task function that logs errors
 */
export function logErrors(taskFn) {
  return name(taskFn.displayName ?? taskFn.name, async () => {
    try {
      await taskFn()
    } catch (error) {
      console.error(`${error}`)
    }
  })
}
