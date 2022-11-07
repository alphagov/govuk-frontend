const { dirname, resolve } = require('path')

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
const destPath = resolve(rootPath, slash(destination))

module.exports = {
  argv,

  // Absolute path to destination
  destination: destPath,

  // Check destination flags
  isPackage: destination === 'package',
  isPublic: destination === 'public',
  isDist: destination === 'dist'
}
