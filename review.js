const express = require('express')
const app = express()
const path = require('path')

// Define the port to run on
app.set('port', 3000)

app.use(express.static(path.join(__dirname, 'preview')))

// Listen for requests
const server = app.listen(app.get('port'), () => {
  let port = server.address().port
})
