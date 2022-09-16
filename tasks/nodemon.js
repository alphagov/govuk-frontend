const nodemon = require('nodemon')
const paths = require('../config/paths.js')

// Nodemon task --------------------------
// Restarts node app for changes affecting
// js and json files
// ---------------------------------------
function runNodemon () {
  return nodemon({
    watch: [
      paths.app,
      paths.src
    ],
    script: 'app/start.js'
  })
}

module.exports = runNodemon
