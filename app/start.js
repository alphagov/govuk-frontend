const configPaths = require('../config/paths.js')
const PORT = process.env.PORT || configPaths.ports.app

const app = require('./app.js')()

app.listen(PORT, () => {
  console.log('Server started at http://localhost:' + PORT)
})
