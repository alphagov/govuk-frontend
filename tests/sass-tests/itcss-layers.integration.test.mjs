import { readFileSync } from 'fs'

import { compileStringAsync } from 'sass-embedded'

import {
  getAllSassFiles,
  extractImports,
  govukFrontendPath
} from './helpers.mjs'
import { sassConfig } from './sass.config.js'

const itcssLayers = [
  'settings',
  'tools',
  'helpers',
  'core',
  'objects',
  'components',
  'utilities',
  'overrides'
]

// Grab a list of all Sass files and sort them alphabetically, for consistent output
const sassFiles = getAllSassFiles().filter((filePath) => {
  const layer = filePath.split('/').at(-2)
  return itcssLayers.includes(layer)
})

describe('ITCSS layers', () => {
  describe.each(itcssLayers)('%s', (layerName) => {
    it('works when user @imports the layer', async () => {
      const sass = `
          @import "node_modules/govuk-frontend/dist/govuk/base";
          @import "node_modules/govuk-frontend/dist/govuk/${layerName}";
        `

      const { css } = await compileStringAsync(sass, sassConfig)

      expect(css).toMatchSnapshot()
    })
  })

  describe('layer imports', () => {
    it.each(sassFiles)(
      '%s only imports from the same or lower layers',
      async (filePath) => {
        const layer = filePath.split('/').at(-2)
        const layerRank = itcssLayers.indexOf(layer)
        const content = readFileSync(
          `${govukFrontendPath}/${filePath}`,
          'utf-8'
        )
        const imports = extractImports(content)

        for (const importPath of imports) {
          const importLayer = importPath.split('/').at(-2)
          const importLayerRank = itcssLayers.indexOf(importLayer)

          try {
            expect(importLayerRank).toBeLessThanOrEqual(layerRank)
          } catch {
            throw new Error(
              `${filePath} (${layer}) imports ${importPath} (${importLayer}).`
            )
          }
        }
      }
    )
  })
})
