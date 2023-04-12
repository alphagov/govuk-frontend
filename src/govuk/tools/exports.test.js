const { outdent } = require('outdent')

const { compileSassString } = require('../../../lib/jest-helpers')

describe('@mixin govuk-exports', () => {
  it('will only output a named section once', async () => {
    const sass = `
      @import "tools/exports";

      @include govuk-exports(foo) {
        .foo {
          color: red;
        }
      }

      @include govuk-exports(foo) {
        .foo {
          color: blue;
        }
      }
    `

    await expect(compileSassString(sass))
      .resolves
      .toMatchObject({
        css: outdent`
          .foo {
            color: red;
          }
        `
      })
  })

  it('will export differently named sections', async () => {
    const sass = `
      @import "tools/exports";

      @include govuk-exports(foo) {
        .foo {
          color: red;
        }
      }

      @include govuk-exports(bar) {
        .bar {
          color: blue;
        }
      }
    `

    await expect(compileSassString(sass))
      .resolves
      .toMatchObject({
        css: outdent`
          .foo {
            color: red;
          }

          .bar {
            color: blue;
          }
        `
      })
  })
})
