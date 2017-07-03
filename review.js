const express = require('express')
const app = express()
const path = require('path')

// Get config vars for Heroku apps
var herokuApp = process.env.HEROKU_APP

console.log('herokuApp var:' + herokuApp)

// Define the port to run on
app.set('port', (process.env.PORT || 3000))

// If this is the Heroku review app
if (herokuApp === 'REVIEW') {
  app.use('/', express.static(path.join(__dirname, 'preview')))
}

// If this is the Heroku demo app
if (herokuApp === 'DEMO') {
  app.use('/', express.static(path.join(__dirname, 'demo')))
}

// Disallow search index indexing
app.use(function (req, res, next) {
  // none - Equivalent to noindex, nofollow
  // noindex - Do not show this page in search results and do not show a "Cached" link in search results.
  // nofollow - Do not follow the links on this page
  res.setHeader('X-Robots-Tag', 'none')
  next()
})

app.get('/robots.txt', function (req, res) {
  res.type('text/plain')
  res.send('User-agent: *\nDisallow: /')
})

app.get('/', (req, res) => {
  res.render('index.html')
})

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'))
})
