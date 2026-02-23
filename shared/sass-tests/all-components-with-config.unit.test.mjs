// Despite being a `.mjs` file, but it'll run as a CommonJS module
// in Jest, so we won't have access to `import.meta.dirname` but `__dirname`
/* global __dirname */

import { paths } from '@govuk-frontend/config'
import { compileStringAsync } from 'sass-embedded'

/** @type {import('sass-embedded').StringOptions<"async">} */
const sassConfig = {
  loadPaths: [paths.root, __dirname],
  quietDeps: true,
  silenceDeprecations: ['import', 'mixed-decls']
}

describe('All components, with configuration', () => {
  it('works when user @imports everything with configuration', async () => {
    const sass = `
      $govuk-functional-colours: (brand: hotpink);
      @function my-url-handler($filename) {
        // Some custom URL handling
        @return url('example.woff');
      }

      $govuk-font-url-function: 'my-url-handler';

      @import "node_modules/govuk-frontend/dist/govuk";
    `

    const { css } = await compileStringAsync(sass, sassConfig)

    expect(css).toMatchSnapshot()
  })

  it('works when user @uses everything with configuration', async () => {
    const sass = `
      @use "sass:meta";
      @use "./assets-urls";

      @use "node_modules/govuk-frontend/dist/govuk" with (
        $govuk-functional-colours: (brand: hotpink),
        $govuk-font-url-function: meta.get-function("fonts-url", $module: "assets-urls")
      );
    `

    const { css } = await compileStringAsync(sass, sassConfig)

    expect(css).toMatchSnapshot()
  })
})
