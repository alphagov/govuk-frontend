const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
const path = require('path')
const views = ['src/views', 'src/components', 'src/examples']

nunjucks.configure(views, {
  autoescape: true,
  express: app,
  noCache: true,
  watch: true
})
app.set('view engine', 'njk')
app.set('port', (process.env.PORT || 3000))

const herokuApp = process.env.HEROKU_APP

console.log('herokuApp var:' + herokuApp)

// looks for html in views folder relative to current working directory
nunjucks.configure(views, {
  autoescape: true,
  cache: false,
  express: app
})

app.get('/', function (req, res) {
  res.render('default')
})

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'))
})

app.get('/components*', function (req, res) {
  var path = (req.params[0]).replace(/\//g, '')
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

app.get('/examples*', function (req, res) {
  res.render('index')
})

app.get('/robots.txt', function (req, res) {
  res.type('text/plain')
  res.send('User-agent: *\nDisallow: /')
})
if (herokuApp == null || herokuApp === 'REVIEW') {
  app.use('/public', express.static(path.join(__dirname, 'public')))
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
