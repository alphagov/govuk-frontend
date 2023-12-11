import express from 'express'

import browserSyncConfig from '../../../browsersync.config.js'

// Map Browsersync static paths as routes object
const browserSyncPaths = Object.fromEntries(
  browserSyncConfig.serveStatic.map(({ route, dir }) => [route, dir])
)

const router = express.Router()

/**
 * Add middleware to serve static assets
 */
for (const route in browserSyncPaths) {
  router.use(
    route,

    // Single route (e.g. `/javascripts`) is mapped to multiple
    // Browsersync directories via static assets middleware
    browserSyncPaths[route].map((assetPath) => {
      return express.static(assetPath)
    })
  )
}

export default router
