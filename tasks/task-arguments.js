const { dirname, relative, resolve } = require('path')

const slash = require('slash')
const { argv } = require('yargs')

// Defaults for known tasks
const destinations = [
  {
    task: 'build:package',
    destination: 'package'
  },
  {
    task: 'build:dist',
    destination: 'dist'
  }
]

// Non-flag arguments
const { _: tasks } = argv

// Prefer `--destination`, default for known task, or 'public'
const destination = argv.destination || (destinations
  .filter(({ task }) => tasks.includes(task))[0]?.destination ?? 'public')

const rootPath = dirname(__dirname)
const destPath = resolve(rootPath, destination)

module.exports = {
  argv,

  // Normalise slashes (Windows) for gulp.src
  destination: slash(relative(rootPath, destPath)),

  // Check destination flags
  isPackage: destination === 'package',
  isPublic: destination === 'public',
  isDist: destination === 'dist'
}
