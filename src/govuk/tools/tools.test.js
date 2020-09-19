/* eslint-env jest */

const glob = require('glob')
const path = require('path')

const sassdoc = require('sassdoc')

const { renderSass } = require('../../../lib/jest-helpers')
const configPaths = require('../../../config/paths.json')

const sassFiles = glob.sync(`${configPaths.src}/tools/**/*.scss`)

describe('The tools layer', () => {
  it('should not output any CSS', async () => {
    const tools = path.join(configPaths.src, 'tools', '_all.scss')

    const output = await renderSass({ file: tools })
    expect(output.css.toString()).toEqual('')
  })

  it.each(sassFiles)('%s renders to CSS without errors', (file) => {
    return renderSass({ file: file })
  })

  describe('Sass documentation', () => {
    it('associates everything with a "tools" group', async () => {
      return sassdoc.parse(path.join(configPaths.src, 'tools', '*.scss'))
        .then(docs => docs.forEach(doc => {
          return expect(doc).toMatchObject({
            // Include doc.context.name in the expected result when this fails,
            // giving you the context to be able to fix it
            context: {
              name: doc.context.name
            },
            group: [
              expect.stringMatching(/^tools/)
            ]
          })
        }))
    })
  })
})
