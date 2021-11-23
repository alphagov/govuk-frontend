'use strict'

// Clean task for a specified folder --------------------
// Removes all old files, except for package.json
// and README in all package
// ------------------------------------------------------

const taskArguments = require('./task-arguments')
var glob = require("glob")
var fs = require("fs")
const { resolve } = require('path')

const destination = taskArguments.destination

if (destination === 'package') {
  glob(`${destination}/**`, { ignore: [`${destination}`,`${destination}/package.json`,`${destination}/govuk-prototype-kit.config.json`,`${destination}/README.md`] }, function (error, files) {
    for (const file of files) {
      try {
        fs.unlinkSync(file)
      } catch (error) {
        fs.rmdir(file, { recursive: true, force: true }, function (error) {
          if (error) {
            console.log(`An error occurred deleting /${file}`)
            throw Error(error)
          } else {
            resolve()
          }
        })
      }
    }
  })
} else {
  fs.rmdir(destination, { recursive: true, force: true }, function (error) {
    if (error) {
      console.log(`An error occurred deleting /${destination}`)
      reject(error)
    } else {
      resolve()
    }
  })
}


