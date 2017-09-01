const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
const path = require('path')
const paths = require('./config/paths.json')
const port = (process.env.PORT || 3000)
const herokuApp = process.env.HEROKU_APP

// Set up views
const appViews = [
  path.join(__dirname, '/src/views/'),
  path.join(__dirname, '/src/components/'),
  path.join(__dirname, '/src/examples/')
]

// Configure nunjucks
nunjucks.configure(appViews, {
  autoescape: true,
  express: app,
  noCache: true,
  watch: true
})

// Set view engine
app.set('view engine', 'njk')

// Set up middleware to serve static assets
app.use('/public', express.static(path.join(__dirname, '/preview')))

app.listen(port, () => {
  console.log('Listening on port ' + port + '   url: http://localhost:' + port)
})

// Set routes

// Index page
app.get('/', function (req, res) {
  res.render('layout')
})

// Examples
app.get('/examples*', function (req, res) {
  res.render('index')
})

// Component isolated preview
app.get('/components/*/preview', function (req, res) {
  var path = (req.params[0]).replace(/\//g, '')
  console.log(path)
  res.render(path, function (err, html) {
    if (err) {
      res.render(path + '/' + path, function (err2, html) {
        if (err2) {
          res.status(404).send(err + '<br>' + err2)
        } else {
          res.end(html)
        }
      })
    } else {
      res.end(html)
    }
  })
})

// Config for Heroku
// If this is the Heroku review app
if (herokuApp === 'REVIEW') {
  app.use('/', express.static(path.join(__dirname, '/preview')))
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
