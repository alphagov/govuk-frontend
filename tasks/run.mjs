import { spawn } from 'child_process'

/**
 * Spawns Node.js child process for npm script
 * rather than using Gulp
 *
 * @param {string} name - npm script name
 * @param {string[]} [args] - npm script arguments
 * @returns {Promise<number>} Exit code
 */
export async function npmScript (name, args = []) {
  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm'

  return new Promise((resolve, reject) => {
    const script = spawn(command, ['run', name, '--silent', ...args])

    // Send output to console
    script.stdout.on('data', (data) => console.log(data.toString()))

    // Emit errors to error listener
    script.stderr.on('data', (data) => {
      script.emit('error', new Error(data.toString()))
    })

    // Reject on actual script errors to exit `gulp dev`
    script.on('error', reject)

    // Check for exit codes or continue `gulp dev`
    script.on('close', (code) => {
      let error

      // Closed with errors
      if (code > 0) {
        error = new Error(`Task for npm script '${name}' exit code ${code}`)

        // Hide error info (already written to `stderr`)
        error.showProperties = false
        error.showStack = false
      }

      // Reject on errors
      error ? reject(error) : resolve(code)
    })
  })
}

/**
 * Creates a Gulp task for npmScript()
 *
 * @param {string} name - npm script name
 * @param {string[]} [args] - npm script arguments
 * @returns {() => Promise<number>} Exit code
 */
export function npmScriptTask (name, args = []) {
  const task = () => npmScript(name, args)

  // Add task alias
  // https://gulpjs.com/docs/en/api/task#task-metadata
  task.displayName = `npm run ${name} ${args.join(' ')}`.trim()

  return task
}
