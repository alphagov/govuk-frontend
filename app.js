const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
const fs = require('fs')
const path = require('path')
const port = (process.env.PORT || 3000)
const herokuApp = process.env.HEROKU_APP
const dto = require('directory-to-object')
const yaml = require('js-yaml')

// Set up views
const appViews = [
  path.join(__dirname, '/src/views/'),
  path.join(__dirname, '/src/components/'),
  path.join(__dirname, '/src/examples/')
]

// Configure nunjucks
let env = nunjucks.configure(appViews, {
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
app.get('/components*', function (req, res, next) {
  let path = req.params[0].slice(1).split('/') // split path into array items: [0 is base component], [1] will be the variant view
  let componentData = yaml.safeLoad(fs.readFileSync(`src/components/${path[0]}/${path[0]}.yaml`, 'utf8'), {json: true})
  res.locals.componentData = componentData  // make it available to the nunjucks template to loop over and display code

  if (path.includes('preview')) {
    // Show the isolated component preview
    let componentNameCapitalized = path[0].charAt(0).toUpperCase() + path[0].slice(1)
    let importStatement = `{% from '${path[0]}/macro.njk' import govuk${componentNameCapitalized} %}` // all our components use the same naming convention
    let macroParameters
    for (let [index, item] of componentData.variants.entries()) {
      let itemData = componentData.variants[index].data
      if (item.name === 'default') {  // default component name != variant, hence we check for default in yaml
        macroParameters = JSON.stringify(itemData, null, '\t')
      } else if (path[1].includes(item.name)) { // associate correct data to variant name
        macroParameters = JSON.stringify(itemData, null, '\t')
      }
    }
    res.locals.componentView = env.renderString(`${importStatement}${`{{ govuk${componentNameCapitalized}(${macroParameters}) }}`}`)
    res.render('component-preview')
  } else {
    // If it isn't the isolated preview, render the component "detail" page
    try {
      // make variables avaliable to nunjucks template
      res.locals.componentPath = path[0]

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
