/* eslint-env jest */

const { renderSass } = require('../../lib/jest-helpers')

const sassConfig = {
  outputStyle: 'compressed'
}

describe('@function image-url', () => {
  it('by default concatenates the image path and the filename', async () => {
    const sass = `
      @import "tools/image-url";

      $govuk-images-path: '/path/to/images/';

      .foo {
        background-image: govuk-image-url("baz.png");
      }`

    const results = await renderSass({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toEqual(
      '.foo{background-image:url("/path/to/images/baz.png")}'
    )
  })

  it('can be overridden to use a defined Sass function', async () => {
    const sass = `
      @import "tools/image-url";

      $govuk-image-url-function: 'to_upper_case';

      .foo {
        background-image: govuk-image-url("baz.png");
      }`

    const results = await renderSass({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toEqual(
      '.foo{background-image:"BAZ.PNG"}'
    )
  })

  it('can be overridden to use a custom function', async () => {
    const sass = `
      @import "tools/image-url";

      @function custom-url-handler($filename) {
        @return url("/custom/#{$filename}");
      }

      $govuk-images-path: '/assets/fonts/';
      $govuk-image-url-function: 'custom-url-handler';

      .foo {
        background-image: govuk-image-url("baz.png");
      }`

    const results = await renderSass({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toEqual(
      '.foo{background-image:url("/custom/baz.png")}'
    )
  })
})
