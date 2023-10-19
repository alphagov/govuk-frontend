import { ports, urls } from '@govuk-frontend/config'

import app from './app.mjs'

const server = await app()

server.listen(ports.app, () => {
  console.log(`Server started at ${urls.app}`)
})
