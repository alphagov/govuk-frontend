const cookies = require('cookie-parser')
const express = require('express')

const router = express.Router()

/**
 * Parses form POST requests into `req.body`
 * that can be used for validation
 */
router.use(express.urlencoded({
  extended: true
}))

/**
 * Parses cookie headers into `req.cookie`
 */
router.use(cookies())

module.exports = router
