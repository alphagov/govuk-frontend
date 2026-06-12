import { promisify } from 'node:util'
import valueParser from 'postcss-value-parser'
import {stringify} from 'csv'

const stringifyCsv = promisify(stringify);

// Usage:
// npx postcss-cli packages/govuk-frontend/dist/govuk/govuk-frontend.min.css --use `pwd`/shared/stats/src/colour-usage.mjs -o /dev/null > govuk-frontend-colours.csv
export default function(options) {
  // First we'll need somewhere to collect the colour instances
  let colourInstances

  return {
    postcssPlugin: 'govuk-frontend/colour-usage',
    Root() {
      colourInstances = []
    },
    Declaration(decl) {
      if (mayContainColour(decl.value)) {
        for(const colour of getColours(decl.value)) {
          if (colour) {
            const colourInstance = {
              ...colour,
              property: decl.prop,
              selector: decl.parent.selector.replaceAll(',',',\n'), //Format selectors on separate lines
              concept: getConcept(decl.parent.selector),
            }

            colourInstances.push(colourInstance)
          }
        }
      }
    },
    async RootExit() {

      let selectorCount = 0;
      for (const colourInstance of colourInstances){
        selectorCount+= colourInstance.selector.split(',').length;
      }
      console.error(colourInstances.length, 'colour instances')
      console.error(selectorCount, 'selectors')

      const columns = [
        {key: 'colour', header: 'Colour'},
        {key: 'function', header: 'Function'},
        {key: 'property', header: 'Used as'},
        {key: 'selector', header: 'Used in'},
        {key: 'concept', header: 'Concept'}
      ];

      const result = await stringifyCsv(colourInstances, {columns, header: true});
      console.log(result)
    },
  }
}

function mayContainColour(declarationValue) {
  return declarationValue.includes('var(') && declarationValue.includes('-colour')
   || declarationValue.includes('#')
   || declarationValue.includes('rgba(')
   || declarationValue.includes('rgb(')
}

/**
 * Extract colours from the given declaration value
 *
 * @param {string} declarationValue - A CSS declaration's value
 * @returns {Array<{colour: string, function?: string}> | null} The detected colours and their function if  any
 */
function getColours(declarationValue) {
  // A single declaration may contain multiple colours (eg. `box-shadow` with multiple shadows)
  const result = [];
  const parsedValue = valueParser(declarationValue);

  parsedValue.walk(valuePart => {
    if (valuePart.type === 'function') {
      // Only handle var, we have no `rgba` or `rgb` in the minified CSS
      // as they've been converted to hex
      if (valuePart.value ==='var') {
        // We can extract the custom property and its fallback
        // from the nodes of the function call
        const [property, fallback] = valuePart.nodes
          .filter(node => node.type === 'word')
          .map(node => node.value);

        // We're only interested in colour properties
        if (property.endsWith('-colour')) {
          result.push({
            colour: fallback,
            function: property.match(/--govuk-(?<function>.*?)-colour/)?.groups['function']
          })
        }
      }
      // We don't want to add extra entries for fallback colours so stop walking
      return false;
    } else if (valuePart.type === 'word') {
      if (valuePart.value.startsWith('#')) {
        result.push({colour: valuePart.value})
      }
    }
  })
  return result;
}

/**
 * Gets which concept in GOV.UK Frontend the selector belongs to
 *
 * 'concept' being the object, component, utilities or overrides
 *
 * @param {string} selector - A CSS selector
 * @returns {string | undefined}
 */
function getConcept(selector) {
  // We need to match usage when the selector is on its own or combined with other selectors
  return selector.match(/^.govuk-(?<concept>[^:#.{ >]*)$/)?.groups?.concept
    || selector.match(/^.govuk-(?<concept>.*?)[:#.{ >]/)?.groups?.concept
}
