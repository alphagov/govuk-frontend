const { outdent } = require('outdent')

const { componentNameToMacroName } = require('../filters/index')

/**
 * Component Nunjucks code (formatted)
 *
 * @param {string} componentName - Component name
 * @param {unknown} params - Component macro params
 * @returns {string} Nunjucks code
 */
function getNunjucksCode (componentName, params) {
  const macroName = componentNameToMacroName(componentName)

  return outdent`
    {% from "govuk/components/${componentName}/macro.njk" import ${macroName} %}

    {{ ${macroName}(${
      JSON.stringify(params, undefined, 2)
    }) }}
  `
}

module.exports = getNunjucksCode
