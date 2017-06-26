const express = require('express')
const app = express()
const path = require('path')

// Define the port to run on
app.set('port', (process.env.PORT || 3000))

app.use('/', express.static(path.join(__dirname, 'preview')))
app.get('/', (req, res) => {
  res.render('index.html')
})

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'))
})
