'use strict'

const argv = require('yargs').argv
const destination = argv.destination ? argv.destination : 'public'
const isProduction = argv.production || false

exports.destination = destination
exports.isProduction = isProduction
