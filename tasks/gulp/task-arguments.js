'use strict'

const argv = require('yargs').argv
const destination = argv.destination ? argv.destination : 'tmp'

exports.destination = destination
