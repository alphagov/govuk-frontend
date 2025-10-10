import { ports } from '@govuk-frontend/config'

import app from './app.mjs'

const server = await app()

server.listen({
  host: 'localhost',
  port: ports.app
})
