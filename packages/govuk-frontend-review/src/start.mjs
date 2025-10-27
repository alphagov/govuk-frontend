import { ports, urls } from '@govuk-frontend/config'

import app from './app.mjs'

const server = await app()

server.listen(
  {
    host: 'localhost',
    port: ports.app
  },
  () => {
    // Allow to disable the startup logs to avoid confusing users
    // if other URLs are showed on screen (Browsersync's URLs, for ex.)
    if (!process.env.REVIEW_APP_SILENT_START) {
      console.log(`Review app started at ${urls.app}`)
    }
  }
)
