const configPaths = require('../config/paths.json')
const PORT = process.env.PORT || configPaths.ports.app

const app = require('./app.js')()

app.listen(PORT, () => {
  console.info('Server started at http://localhost:' + PORT)
})
