import { compileSassStringLikeUsers } from './helpers/sass.js'

describe('`pkg:` URLs', () => {
  describe.each([
    [
      'Importing button and cookie banner with base',
      `
      @import "node_modules/govuk-frontend/src/govuk/base";
      @import "node_modules/govuk-frontend/src/govuk/components/button";
      @import "node_modules/govuk-frontend/src/govuk/components/cookie-banner";
      `,
      `
      @use "node_modules/govuk-frontend/src/govuk/base";
      @use "node_modules/govuk-frontend/src/govuk/components/button";
      @use "node_modules/govuk-frontend/src/govuk/components/cookie-banner";
      `
    ],
    [
      'Importing button and cookie banner without base',
      `
      @import "node_modules/govuk-frontend/src/govuk/components/button";
      @import "node_modules/govuk-frontend/src/govuk/components/cookie-banner";
      `,
      `
      @use "node_modules/govuk-frontend/src/govuk/components/button";
      @use "node_modules/govuk-frontend/src/govuk/components/cookie-banner";
      `
    ],
    [
      'Importing button and cookie banner with config',
      `
      $govuk-font-family: 'Comic Sans MS';
      @import "node_modules/govuk-frontend/src/govuk/base";
      @import "node_modules/govuk-frontend/src/govuk/components/button";
      @import "node_modules/govuk-frontend/src/govuk/components/cookie-banner";
      `,
      `
      @use "node_modules/govuk-frontend/src/govuk/base" with (
        $govuk-font-family: 'Comic Sans MS'
      );
      @use "node_modules/govuk-frontend/src/govuk/components/button";
      @use "node_modules/govuk-frontend/src/govuk/components/cookie-banner";
      `
    ],
    [
      'Importing button and cookie banner without base, with config',
      `
      $govuk-font-family: 'Comic Sans MS';
      @import "node_modules/govuk-frontend/src/govuk/components/button";
      @import "node_modules/govuk-frontend/src/govuk/components/cookie-banner/cookie-banner";
      `,
      `
      @use "node_modules/govuk-frontend/src/govuk/base" with (
        $govuk-font-family: 'Comic Sans MS'
      );
      @use "node_modules/govuk-frontend/src/govuk/components/button";
      @use "node_modules/govuk-frontend/src/govuk/components/cookie-banner";
      `
    ],
    [
      'Importing non-component layers, with config',
      `
      $govuk-font-family: 'Comic Sans MS';
      @import "node_modules/govuk-frontend/src/govuk/objects";
      @import "node_modules/govuk-frontend/src/govuk/utilities";
      @import "node_modules/govuk-frontend/src/govuk/overrides";
      `,
      `
      @use "node_modules/govuk-frontend/src/govuk/base" with (
        $govuk-font-family: 'Comic Sans MS'
      );
      @use "node_modules/govuk-frontend/src/govuk/objects";
      @use "node_modules/govuk-frontend/src/govuk/utilities";
      @use "node_modules/govuk-frontend/src/govuk/overrides";
      `
    ],
    [
      'Importing everything separately with extreme configuration',
      `
      $govuk-font-family: 'Comic Sans MS';
      $govuk-assets-path: '/foo/';

      @import "node_modules/govuk-frontend/src/govuk/core";
      @import "node_modules/govuk-frontend/src/govuk/objects";
      @import "node_modules/govuk-frontend/src/govuk/components";
      @import "node_modules/govuk-frontend/src/govuk/utilities";
      @import "node_modules/govuk-frontend/src/govuk/overrides";
      `,
      `
      @use "node_modules/govuk-frontend/src/govuk/base" with (
        $govuk-font-family: 'Comic Sans MS',
        $govuk-assets-path: '/foo/'
      );
      @use "node_modules/govuk-frontend/src/govuk/core";
      @use "node_modules/govuk-frontend/src/govuk/objects";
      @use "node_modules/govuk-frontend/src/govuk/components";
      @use "node_modules/govuk-frontend/src/govuk/utilities";
      @use "node_modules/govuk-frontend/src/govuk/overrides";
      `
    ]
  ])('%s', (_, importSass, useSass) => {
    let cssFromUse

    beforeEach(async () => {
      cssFromUse = await compileSassStringLikeUsers(importSass)
    })

    it('outputs the same CSS using @use and @import', async () => {
      const css = await compileSassStringLikeUsers(useSass)

      expect(css).toBe(cssFromUse)
    })
  })
})
