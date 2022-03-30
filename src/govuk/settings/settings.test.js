/* eslint-env jest */

const glob = require('glob')
const path = require('path')

const sassdoc = require('sassdoc')

const { renderSassFile } = require('../../../lib/jest-helpers')
const configPaths = require('../../../config/paths.json')

const sassFiles = glob.sync(`${configPaths.src}/settings/**/*.scss`)

describe('The settings layer', () => {
  it('should not output any CSS', async () => {
    const filePath = path.join(configPaths.src, 'settings', '_all.scss')

    const output = await renderSassFile(filePath)
    expect(output.css.toString()).toEqual('')
  })

  it.each(sassFiles)('%s renders to CSS without errors', (file) => {
    return renderSassFile(file)
  })

  describe('Sass documentation', () => {
    it('associates everything with a "settings" group', async () => {
      return sassdoc.parse(path.join(configPaths.src, 'settings', '*.scss'))
        .then(docs => docs.forEach(doc => {
          return expect(doc).toMatchObject({
            // Include doc.context.name in the expected result when this fails,
            // giving you the context to be able to fix it
            context: {
              name: doc.context.name
            },
            group: [
              expect.stringMatching(/^settings/)
            ]
          })
        }))
    })
  })
})
