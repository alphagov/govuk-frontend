const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
const path = require('path')
const paths = require('./config/paths.json')
const views = ['src/views', 'src/components', 'src/examples']

nunjucks.configure(views, {
  autoescape: true,
  express: app,
  noCache: true,
  watch: true
})
app.set('view engine', 'njk')
app.set('port', (process.env.PORT || 3000))

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
  // var path = (req.params[0]).replace(/\//g, '')
  // res.render(path, function (err, html) {
  //   if (err) {
  //     res.render(path + '/' + path, function (err2, html) {
  //       if (err2) {
  //         res.status(404).send(err + '<br>' + err2)
  //       } else {
  //         res.end(html)
  //       }
  //     })
  //   } else {
  //     res.end(html)
  //   }
  // })
  res.render('index')
})

var sassMiddleware = require('node-sass-middleware')
app.use(sassMiddleware({
    /* Options */
    src: paths.globalScss,
    dest: '/public',
    debug: true,
    outputStyle: 'compressed',
    prefix: '/public'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));
// Note: you must place sass-middleware *before* `express.static` or else it will
// not work.
// app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static('public'))
