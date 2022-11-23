const configPaths = require('../config/paths')

const app = require('./app')

const PORT = process.env.PORT || configPaths.ports.app

app()
  .then(server => server.listen(PORT, () =>
    console.log('Server started at http://localhost:' + PORT)
  ))
  .catch(console.error)
