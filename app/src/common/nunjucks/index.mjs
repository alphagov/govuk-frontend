
import { join } from 'path'

import nunjucks from 'nunjucks'

import { paths } from '../../../../config/index.js'

import * as filters from './filters/index.mjs'
import * as globals from './globals/index.mjs'

export function renderer (app) {
  const appViews = [
    join(paths.app, 'src/views/layouts'),
    join(paths.app, 'src/views'),
    join(paths.src, 'govuk/components'),
    join(paths.src, 'govuk'),
    join(paths.root, 'node_modules/govuk_template_jinja')
  ]

  // Initialise nunjucks environment
  const env = nunjucks.configure(appViews, {
    autoescape: true, // output with dangerous characters are escaped automatically
    express: app, // the express app that nunjucks should install to
    noCache: true, // never use a cache and recompile templates each time
    trimBlocks: true, // automatically remove trailing newlines from a block/tag
    lstripBlocks: true, // automatically remove leading whitespace from a block/tag
    watch: true // reload templates when they are changed. needs chokidar dependency to be installed
  })

  // Set view engine
  app.set('view engine', 'njk')

  // Share feature flags with middleware
  env.addGlobal('flags', app.get('flags'))

  // Custom filters
  for (const key in filters) {
    env.addFilter(key, filters[key])
  }

  // Custom globals
  for (const key in globals) {
    env.addGlobal(key, globals[key])
  }

  return env
}
