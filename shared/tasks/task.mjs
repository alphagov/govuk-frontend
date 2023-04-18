/**
 * Creates a Gulp task with display name
 *
 * {@link https://gulpjs.com/docs/en/api/task#task-metadata}
 *
 * @template {(function(): Promise<void>) & { displayName?: string }} TaskFunction
 * @param {string} displayName - Task name for Gulp CLI
 * @param {TaskFunction} taskFn - Task function to wrap
 * @returns {TaskFunction} Script run
 */
export function name (displayName, taskFn) {
  taskFn.displayName = displayName
  return taskFn
}
