const express = require('express')
const app = express()
const path = require('path')

// Get config vars for Heroku apps
var herokuAppReview = process.env.HEROKU_REVIEW
var herokuAppDemo = process.env.HEROKU_DEMO

// Define the port to run on
app.set('port', (process.env.PORT || 3000))

// If this is the Heroku review app
if (herokuAppReview === 'HEROKU_REVIEW') {
  app.use('/', express.static(path.join(__dirname, 'preview')))
}

// If this is the Heroku demo app
if (herokuAppDemo === 'HEROKU_DEMO') {
  app.use('/', express.static(path.join(__dirname, 'demo')))
}

app.get('/', (req, res) => {
  res.render('index.html')
})

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'))
})
