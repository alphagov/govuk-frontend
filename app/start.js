const app = require('./app.js')
const configPaths = require('../config/paths.js')

const PORT = process.env.PORT || configPaths.ports.app

app().then(server => server.listen(PORT, () => {
  console.log('Server started at http://localhost:' + PORT)
}))
