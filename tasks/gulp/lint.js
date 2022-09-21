const gulp = require('gulp')
const { spawn } = require('child_process')

/**
 * JavaScript code quality checks via ESLint
 */
gulp.task('js:lint', () => {
  return runTask('lint:js', ['--silent'])
})

/**
 * Sass code quality checks via Stylelint
 */
gulp.task('scss:lint', () => {
  return runTask('lint:scss', ['--silent'])
})

/**
 * Spawns Node.js child process for npm task
 * rather than using Gulp
 *
 * @param {string} name - npm script name
 * @param {string[]} [args] - npm script arguments
 * @returns {Promise<number>} Exit code
 */
async function runTask (name, args = []) {
  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm'

  return new Promise((resolve, reject) => {
    const task = spawn(command, ['run', name, ...args])

    task.stdout.on('data', (data) => console.log(data.toString()))
    task.stderr.on('data', (data) => console.error(data.toString()))

    // Reject on actual task errors to exit `gulp watch`
    task.on('error', reject)

    // Resolve all exit codes to continue `gulp watch`
    task.on('close', resolve)
  })
}
