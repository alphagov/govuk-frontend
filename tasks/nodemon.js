const nodemon = require('nodemon')
const configPaths = require('../config/paths.js')

/**
 * Nodemon task
 * Restarts Node.js app when there are changes
 * affecting .js, .mjs and .json files
 */
function runNodemon () {
  return nodemon({
    watch: [
      configPaths.app,
      configPaths.src
    ],
    script: 'app/start.js'
  })
}

module.exports = runNodemon
