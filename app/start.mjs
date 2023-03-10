import { ports } from '../config/index.js'

import app from './app.mjs'

const server = await app()

server.listen(ports.app, () => {
  console.log(`Server started at http://localhost:${ports.app}`)
})
