const express = require('express')
const componentRouter = express.Router()

const fileHelper = require('../../lib/file-helper')
const helperFunctions = require('../../lib/helper-functions')

// Whenever the route includes a :component parameter, read the component data
// from its YAML file
componentRouter.param('component', (request, response, next, componentName) => {
  response.locals.componentData = fileHelper.getComponentData(componentName)
  next()
})

componentRouter.get('/all', (request, response, next) => {
  const components = fileHelper.allComponents

  response.locals.componentData = components.map(componentName => {
    let componentData = fileHelper.getComponentData(componentName)
    let defaultExample = componentData.examples.find(
      example => example.name === 'default'
    )
    return {
      componentName,
      examples: [defaultExample]
    }
  })
  response.render(`all-components`, (error, html) => {
    if (error) {
      next(error)
    } else {
      response.send(html)
    }
  })
})

// Component 'README' page
componentRouter.get('/:component', (request, response, next) => {
  // make variables available to nunjucks template
  response.locals.componentPath = request.params.component

  response.render('component', (error, html) => {
    if (error) {
      next(error)
    } else {
      response.send(html)
    }
  })
})

// Component example preview
componentRouter.get('/:component/:example*?/preview', (request, response, next) => {
  // Find the data for the specified example (or the default example)
  let componentName = request.params.component
  let requestedExampleName = request.params.example || 'default'

  let previewLayout = response.locals.componentData.previewLayout || 'layout'

  let exampleConfig = response.locals.componentData.examples.find(
    example => example.name.replace(/ /g, '-') === requestedExampleName
  )

  if (!exampleConfig) {
    next()
  }

  // Construct and evaluate the component with the data for this example
  let macroName = helperFunctions.componentNameToMacroName(componentName)
  let macroParameters = JSON.stringify(exampleConfig.data, null, '\t')

  response.locals.componentView = request.app.get('nunjucksEnv').renderString(
    `{% from '${componentName}/macro.njk' import ${macroName} %}
    {{ ${macroName}(${macroParameters}) }}`
  )

  let bodyClasses = ''
  if (request.query.iframe) {
    bodyClasses = 'app-iframe-in-component-preview'
  }

  response.render('component-preview', { bodyClasses, previewLayout })
})

module.exports = componentRouter
