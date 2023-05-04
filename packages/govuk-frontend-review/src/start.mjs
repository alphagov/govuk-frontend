import { ports } from 'govuk-frontend-config'

import app from './app.mjs'

const server = await app()

server.listen(ports.app, () => {
  console.log(`Server started at http://localhost:${ports.app}`)
})
