import { ports } from '@govuk-frontend/config'

import app from './app.mjs'

const server = await app()

server.listen({
  host: process.env.ALLOW_EXTERNAL_CONNECTIONS ? null : 'localhost',
  port: ports.app
})
