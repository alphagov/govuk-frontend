const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
const fs = require('fs')
const path = require('path')
const port = (process.env.PORT || 3000)
const herokuApp = process.env.HEROKU_APP
const dto = require('directory-to-object')

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
app.use('/public', express.static(path.join(__dirname, '/public')))
app.use('/icons', express.static(path.join(__dirname, '/public/icons')))

app.listen(port, () => {
  console.log('Listening on port ' + port + '   url: http://localhost:' + port)
})

// Routes

// Return an object representing the components directory
dto(path.resolve('./src/components'), (err, res) => {
  if (err) {
    console.log(err)
  }
  app.locals.componentsDirectory = res
})

// Return an object representing the examples directory
dto(path.resolve('./src/views/examples'), (err, res) => {
  if (err) {
    console.log(err)
  }
  app.locals.examplesDirectory = res
})
// Index page - render the component list template
app.get('/', function (req, res) {
  res.render('component-list')
})

// Components
app.get('/components*', function (req, res) {
  let path = req.params[0].slice(1).split('/') // split path into array items: [0 is base component], [1] will be the variant view

  if (path.includes('preview')) {
    // if this is a variant we need base component and variants for the template
    if (path[1].includes('--')) {
      res.locals.variantName = path[1]
      res.locals.variantBase = path[0]
      res.locals.componentPath = path.join('/')
    } else {
      // Show the isolated component preview
      res.locals.componentPath = path[0]
    }
    res.render('component-preview')
  } else {
    // If it isn't the isolated preview, render the component "detail" page
    try {
      let componentNjk = fs.readFileSync('src/components/' + path[0] + '/' + path[0] + '.njk', 'utf8')
      // on npm run start we generate html files in public (which is git ignored) and use that to insert into the template
      let componentHtml = fs.readFileSync('public/components/' + path[0] + '/' + path[0] + '.html', 'utf8')

      // we want to show all variants' code and macros on the component details page
      let allFiles = fs.readdirSync('src/components/' + path[0] + '/')
      let variantItems = []

      allFiles.forEach(file => {
        if (file.indexOf('.njk') > -1 && file.indexOf('--') > -1) {
          let fileName = file.split('.')[0]
          let njk = fs.readFileSync('src/components/' + path[0] + '/' + fileName + '.njk', 'utf8')
          let html = fs.readFileSync('public/components/' + path[0] + '/' + fileName + '.html', 'utf8')
          variantItems.push({
            njk: njk,
            name: fileName,
            html: html
          })
        }
      })

      // make variables avaiable to nunjucks template
      res.locals.componentPath = path[0]
      res.locals.componentNunjucksFile = componentNjk
      res.locals.componentHtmlFile = componentHtml
      res.locals.variantItems = variantItems

      // component details page in index.njk
      res.render(path[0] + '/' + 'index')
    } catch (e) {
      console.log('Error:', e.stack)
    }
  }
})

// Examples
app.get('/examples', function (req, res) {
  res.render('example-list')
})

app.get('/examples/*', function (req, res) {
  let path = req.params[0].split('/')
  // component details page in index.njk
  res.render('examples/' + path[0] + '/' + 'index')
})

// Config for Heroku

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
