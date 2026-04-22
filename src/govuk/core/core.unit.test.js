const { readFile } = require('node:fs/promises')
const { join } = require('node:path')

const { paths } = require('@govuk-frontend/config')
const {
  compileSassString,
  getSassPathsFromLayer,
  compileSassFile
} = require('@govuk-frontend/helpers/tests')
const stylelint = require('stylelint')

const partials = getSassPathsFromLayer('core')

describe('The core layer', () => {
  describe.each([
    [
      'import',
      `
      @import "base";
      @import "core";
    `
    ],
    ['use', `@use "core";`]
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
          'Warnings were present when testing the core layer for unknown custom properties:'
        )
        console.log(linter.results[0].warnings)
      }

      return expect(linter.results[0].warnings).toHaveLength(0)
    })

    describe('placeholder selectors', () => {
      it('generates selector combining placeholders from list and typography', () => {
        expect(css).toContain('.govuk-list + .govuk-heading-s')
      })

      it('generates selectors when placeholders for list and typography are extended', async () => {
        const { css } = await compileSassString(`
          ${sass}

          ul {
            @extend %govuk-list;
          }

          h2 {
            @extend %govuk-heading-s;
          }
        `)

        expect(css).toContain('ul + .govuk-heading-s')
        expect(css).toContain('.govuk-list + h2')
        expect(css).toContain('ul + h2')
      })
    })
  })

  describe.each(partials)('$name', ({ partialPath, name }) => {
    let css
    beforeAll(async () => {
      const file = join(paths.package, partialPath)

      css = (await compileSassFile(file)).css
    })

    // Sass will error when trying to access an undefined variable or mixin
    // but will not on a function, so we need to check the output for calls
    // to GOV.UK Frontend's API that are not namespaced with `base.`
    it('does not contain any unexpected govuk- function calls', async () => {
      const matches = css.matchAll(/_?govuk-[\w-]+\(.*?\)/g)

      // `matchAll` does not return an actual `Array` so we need
      // a little conversion before we can check its length
      expect(Array.from(matches)).toHaveLength(0)
    })

    it('has a corresponding import-only file', async () => {
      const importOnlyPath = join(
        paths.package,
        partialPath.replace('.scss', '.import.scss')
      )
      const { moduleName } = /_(?<moduleName>.*)\.scss/.exec(name).groups

      const fileContent = await readFile(importOnlyPath, { encoding: 'utf-8' })

      expect(fileContent).toContain(
        `@include govuk-exports("govuk/core/${moduleName}")`
      )
    })
  })
})
