import parser from 'yargs-parser'

// Non-flag arguments as tasks
const { _: tasks } = parser(process.argv)

// Check for development task
export const isDev = tasks.includes('dev')
