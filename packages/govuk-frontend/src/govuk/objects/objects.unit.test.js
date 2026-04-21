const { join } = require('path')

const { paths } = require('@govuk-frontend/config')
const {
  compileSassFile,
  getSassPathsFromLayer
} = require('@govuk-frontend/helpers/tests')
const { compileSassString } = require('@govuk-frontend/helpers/tests')
const sassdoc = require('sassdoc')
const stylelint = require('stylelint')

const partials = getSassPathsFromLayer('objects')

describe('The objects layer', () => {
  describe.each([
    [
      'import',
      `
      @import "base";
      @import "objects";
    `
    ],
    ['use', `@use "objects";`]
  ])('with `@%s`', (type, sass) => {
    let css

    beforeAll(async () => {
      css = (await compileSassString(sass)).css
    })

    it('outputs the custom properties only once', () => {
      const occurrences = css.matchAll(/--govuk-breakpoint-mobile/g)

      expect(Array.from(occurrences)).toHaveLength(1)
    })

    it('does not reference any undefined custom properties', async () => {
      const linter = await stylelint.lint({
        config: { rules: { 'no-unknown-custom-properties': true } },
        code: css
      })

      // Output stylelint warnings to make debugging easier
      if (linter.results[0].warnings.length) {
        console.log(
          'Warnings were present when testing the objects layer for unknown custom properties:'
        )
        console.log(linter.results[0].warnings)
      }

      return expect(linter.results[0].warnings).toHaveLength(0)
    })
  })

  describe.each(partials)('$name', ({ partialPath, name }) => {
    it('renders without errors', () => {
      const file = join(paths.package, partialPath)

      return expect(compileSassFile(file)).resolves.toMatchObject({
        css: expect.any(String),
        loadedUrls: expect.arrayContaining([expect.any(URL)])
      })
    })
  })

  describe('Sass documentation', () => {
    it('associates everything with a "objects" group', async () => {
      const docs = await sassdoc.parse(
        join(paths.package, 'src/govuk/objects/**/*.scss')
      )

      for (const doc of docs) {
        expect(doc).toMatchObject({
          // Include doc.context.name in the expected result when this fails,
          // giving you the context to be able to fix it
          context: {
            name: doc.context.name
          },
          group: [expect.stringMatching(/^objects/)]
        })
      }
    })
  })
})
