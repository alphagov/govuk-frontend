import { compileSassStringLikeUsers } from './helpers/sass.js'

describe('libraries', () => {
  describe('if the library `@import`s GOV.UK Frontend', () => {
    describe('without configuration', () => {
      let css

      beforeAll(async () => {
        // Sass does not resolve import-only files when using `pkg:` URLs
        // with `@import` so we need to explicitely load `index.import`
        // See: https://github.com/sass/sass/issues/4224
        const sass = `
          @import 'pkg:govuk-frontend/index.import';
          @import 'libraries/with-import/index';
        `

        css = await compileSassStringLikeUsers(sass)
      })

      it('outputs the CSS of GOV.UK Frontend only once', async () => {
        expect(css.match(/govuk-visually-hidden/)).toHaveLength(1)
      })

      it('applied the default GOV.UK Frontend configuration to the library', async () => {
        expect(css).toContain(
          '--with-import-colour: var(--govuk-brand-colour, #1d70b8)'
        )
        expect(css).toContain(
          '--with-import-icon: url("/assets/images/home-icon.svg")'
        )
      })
    })

    describe('with configuration', () => {
      let css

      beforeAll(async () => {
        const sass = `
          $govuk-functional-colours: (brand: hotpink);
          $govuk-image-url-function: 'images-url';

          @import 'pkg:@govuk-frontend/helpers/assets-urls';
          @import 'pkg:govuk-frontend/index.import';
          @import 'libraries/with-import/index';
        `

        css = await compileSassStringLikeUsers(sass)
      })

      it('applies configuration to both GOV.UK Frontend and the library', async () => {
        expect(css).toContain('--govuk-brand-colour: hotpink')
        expect(css).toContain(
          '--with-import-colour: var(--govuk-brand-colour, hotpink)'
        )
        expect(css).toContain('--with-import-icon: url("example.svg")')
      })
    })

    describe('without explicitly `@import`ing GOV.UK Frontend', () => {
      let css

      beforeAll(async () => {
        const sass = `
          $govuk-functional-colours: (brand: hotpink);
          $govuk-image-url-function: 'images-url';

          @import 'pkg:@govuk-frontend/helpers/assets-urls';
          @import 'libraries/with-import/index';
        `

        css = await compileSassStringLikeUsers(sass)
      })

      it('applies configuration to both GOV.UK Frontend and the library', async () => {
        expect(css).toContain('--govuk-brand-colour: hotpink')
        expect(css).toContain(
          '--with-import-colour: var(--govuk-brand-colour, hotpink)'
        )
        expect(css).toContain('--with-import-icon: url("example.svg")')
      })
    })
  })

  describe('if the library `@use`s GOV.UK Frontend', () => {
    describe('without configuration', () => {
      let css

      beforeAll(async () => {
        const sass = `
          @use 'pkg:govuk-frontend';
          @use 'libraries/with-use';
        `

        css = await compileSassStringLikeUsers(sass)
      })

      it('outputs the CSS of GOV.UK Frontend only once', async () => {
        expect(css.match(/govuk-visually-hidden/)).toHaveLength(1)
      })

      it('applied the default GOV.UK Frontend configuration to the library', async () => {
        expect(css).toContain(
          '--with-use-colour: var(--govuk-brand-colour, #1d70b8)'
        )
        expect(css).toContain(
          '--with-use-icon: url("/assets/images/home-icon.svg")'
        )
      })
    })

    describe('with configuration', () => {
      let css

      beforeAll(async () => {
        const sass = `
          @use "sass:meta";
          @use 'pkg:@govuk-frontend/helpers/assets-urls';
          @use 'pkg:govuk-frontend' with (
            $govuk-functional-colours: (brand: hotpink),
            $govuk-image-url-function: meta.get-function('images-url', $module: 'assets-urls')
          );
          @use 'libraries/with-use';
        `

        css = await compileSassStringLikeUsers(sass)
      })

      it('applies configuration to both GOV.UK Frontend and the library', async () => {
        expect(css).toContain('--govuk-brand-colour: hotpink')
        expect(css).toContain(
          '--with-use-colour: var(--govuk-brand-colour, hotpink)'
        )
        expect(css).toContain('--with-use-icon: url("example.svg")')
      })
    })
  })

  describe('if a library `@forward`s GOV.UK Frontend and another `@use`s it', () => {
    describe('without configuration', () => {
      let css

      beforeAll(async () => {
        const sass = `
          @use 'libraries/with-forward';
          @use 'libraries/with-use';
        `

        css = await compileSassStringLikeUsers(sass)
      })

      it('outputs the CSS of GOV.UK Frontend only once', async () => {
        expect(css.match(/govuk-visually-hidden/)).toHaveLength(1)
      })

      it('applied the default GOV.UK Frontend configuration to both libaries', async () => {
        expect(css).toContain(
          '--with-use-colour: var(--govuk-brand-colour, #1d70b8)'
        )
        expect(css).toContain(
          '--with-use-icon: url("/assets/images/home-icon.svg")'
        )
        expect(css).toContain(
          '--with-forward-colour: var(--govuk-brand-colour, #1d70b8)'
        )
        expect(css).toContain(
          '--with-forward-icon: url("/assets/images/home-icon.svg")'
        )
      })
    })

    describe('with configuration', () => {
      let css

      beforeAll(async () => {
        const sass = `
          @use "sass:meta";
          @use 'pkg:@govuk-frontend/helpers/assets-urls';
          @use 'libraries/with-forward' with (
            $govuk-functional-colours: (brand: hotpink),
            $govuk-image-url-function: meta.get-function('images-url', $module: 'assets-urls')
          );
          @use 'libraries/with-use';
        `

        css = await compileSassStringLikeUsers(sass)
      })

      it('applies configuration to both GOV.UK Frontend and the libraries', async () => {
        expect(css).toContain('--govuk-brand-colour: hotpink')
        expect(css).toContain(
          '--with-use-colour: var(--govuk-brand-colour, hotpink)'
        )
        expect(css).toContain('--with-use-icon: url("example.svg")')
        expect(css).toContain(
          '--with-forward-colour: var(--govuk-brand-colour, hotpink)'
        )
        expect(css).toContain('--with-forward-icon: url("example.svg")')
      })
    })
  })
})
