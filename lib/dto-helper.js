'use strict'

const dto = require('directory-to-object')

// Convert directory to object
//
// This helper function takes a directory path, analyzes the structure
// and returns the associated object (JSON representation).
// Expects a flat folder structure with either files or directories.
const directoryToObject = (path) => {
  return new Promise((resolve, reject) => {
    dto(path, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}
exports.directoryToObject = directoryToObject
