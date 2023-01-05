const config = require('../config')

const app = require('./app')

const PORT = process.env.PORT || config.ports.app

app()
  .then(server => server.listen(PORT, () =>
    console.log('Server started at http://localhost:' + PORT)
  ))
  .catch(console.error)
