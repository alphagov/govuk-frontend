/* eslint-env jest */

const { renderSass } = require('../../../lib/jest-helpers')

const sassConfig = {
  outputStyle: 'compact'
}

describe('@mixin govuk-link-decoration', () => {
  it('sets text-decoration with a thickness of 1px', async () => {
    const sass = `
      $govuk-link-underline-thickness: 1px;
      @import "base";

      .foo {
        @include govuk-link-decoration;
      }`

    const results = await renderSass({ data: sass, ...sassConfig })

    expect(results.css.toString()).toContain('text-decoration-thickness: 1px;')
  })

  describe('when $govuk-link-underline-thickness is falsey', () => {
    it('sets text-decoration with a thickness of auto', async () => {
      const sass = `
        $govuk-link-underline-thickness: false;
        @import "base";

        .foo {
          @include govuk-link-decoration;
        }`

      const results = await renderSass({ data: sass, ...sassConfig })

      expect(results.css.toString()).not.toContain('text-decoration-thickness;')
    })
  })

  it('sets text-underline-offset', async () => {
    const sass = `
      $govuk-link-underline-offset: .1em;
      @import "base";

      .foo {
        @include govuk-link-decoration;
      }`

    const results = await renderSass({ data: sass, ...sassConfig })

    expect(results.css.toString()).toContain('text-underline-offset: 0.1em;')
  })

  describe('when $govuk-link-underline-offset is falsey', () => {
    it('does not set text-decoration-offset ', async () => {
      const sass = `
      $govuk-link-underline-offset: false;
      @import "base";

      .foo {
          @include govuk-link-decoration;
      }`

      const results = await renderSass({ data: sass, ...sassConfig })

      expect(results.css.toString()).not.toContain('text-underline-offset')
    })
  })

  it('sets text-decoration-thickness on hover', async () => {
    const sass = `
    $govuk-link-hover-underline-thickness: 10px;
      @import "base";

      .foo {
        @include govuk-link-decoration;
      }`

    const results = await renderSass({ data: sass, ...sassConfig })

    expect(results.css.toString()).toContain('.foo:hover { text-decoration-thickness: 10px; }')
  })

  describe('when $govuk-link-hover-underline-thickness is falsey', () => {
    it('does not set a hover state', async () => {
      const sass = `
      $govuk-link-hover-underline-thickness: false;
      @import "base";

      .foo {
          @include govuk-link-decoration;
      }`

      const results = await renderSass({ data: sass, ...sassConfig })

      expect(results.css.toString()).not.toContain(':hover')
    })
  })
})
