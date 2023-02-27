const outdent = require('outdent')

const { compileSassString } = require('../../../lib/jest-helpers')

describe('@mixin govuk-if-ie8', () => {
  it('outputs @content when $govuk-is-ie8 is true', async () => {
    const sass = `
      $govuk-is-ie8: true;
      @import "tools/ie8";

      @include govuk-if-ie8 {
        .foo {
          color: red;
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

  it('does not output @content when $govuk-is-ie8 is false', async () => {
    const sass = `
      $govuk-is-ie8: false;
      @import "tools/ie8";

      @include govuk-if-ie8 {
        .foo {
          color: red;
        }
      }
    `

    await expect(compileSassString(sass))
      .resolves
      .toMatchObject({ css: '' })
  })
})

describe('@mixin govuk-not-ie8', () => {
  it('outputs @content when $govuk-is-ie8 is false', async () => {
    const sass = `
      $govuk-is-ie8: false;
      @import "tools/ie8";

      @include govuk-not-ie8 {
        .foo {
          color: red;
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

  it('does not output @content when $govuk-is-ie8 is true', async () => {
    const sass = `
      $govuk-is-ie8: true;
      @import "tools/ie8";

      @include govuk-not-ie8 {
        .foo {
          color: red;
        }
      }
    `

    await expect(compileSassString(sass))
      .resolves
      .toMatchObject({ css: '' })
  })
})
