const parser = require('yargs-parser')

// Non-flag arguments as tasks
const { _: tasks } = parser(process.argv)

// Check for development task
module.exports.isDev = tasks.includes('dev')
