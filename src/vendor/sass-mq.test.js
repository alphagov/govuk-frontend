/* eslint-env jest */

const util = require('util')

const configPaths = require('../../config/paths.json')

const sass = require('node-sass')
const sassRender = util.promisify(sass.render)
const outdent = require('outdent')

const sassConfig = {
  includePaths: [ configPaths.src ],
  outputStyle: 'compressed'
}
describe('sass-mq', () => {
  describe('mq-px2em function', () => {
    it('converts px value to em', async () => {
      const sass = `
        @import "vendor/sass-mq";

        .foo {
          width: mq-px2em(320px);
        }`

      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe('.foo{width:20em}')
    })

    it('assumes unitless value is px and converts it to em', async () => {
      const sass = `
        @import "vendor/sass-mq";

        .foo {
          width: mq-px2em(640);
        }`

      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe('.foo{width:40em}')
    })

    it('accepts em value and outputs the same em value', async () => {
      const sass = `
        @import "vendor/sass-mq";

        .foo {
          width: mq-px2em(40em);
        }`

      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe('.foo{width:40em}')
    })

    it('$mq-base-font-size change results in updated calculation', async () => {
      const sass = `
        $mq-base-font-size: 19px;
        @import "vendor/sass-mq";

        .foo {
          width: mq-px2em(320px);
        }`

      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe('.foo{width:16.84211em}')
    })
  })

  describe('@mq-get-breakpoint-width function', () => {
    it('outputs media query value from the breakpoint map', async () => {
      const sass = `
        $my-breakpoints: (
          mobile:  320px,
          tablet:  641px,
          desktop: 769px
        );
        @import "vendor/sass-mq";

        .foo {
          @media (min-width: mq-get-breakpoint-width('desktop', $my-breakpoints)) {
            color: red;
          }
        }`

      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe('@media (min-width: 769px){.foo{color:red}}')
    })

    it('errors if the specified breakpoint does not exists in the map', async () => {
      const data = `
        $my-breakpoints: (
          mobile:  320px,
          tablet:  641px,
          desktop: 769px
        );

        @import "vendor/sass-mq";

        $value: mq-get-breakpoint-width('massive', $my-breakpoints);
        `

      // Stub out the @warn function so that we can assert on warnings that are
      // thrown during compilation
      const warnings = []

      const customFuncs = {
        '@warn': (warning) => {
          warnings.push(warning.getValue())

          return sass.NULL
        }
      }

      // Lost far too much time trying to make this test work with Promises,
      // but couldn't get it to work. So we're doing it old school.
      sass.render({ data: data, functions: customFuncs, ...sassConfig }, () => {
        expect(warnings).toContain('Breakpoint massive wasn\'t found in $breakpoints.')
      })
    })
  })

  describe('@mq-add-breakpoint mixin', () => {
    it('outputs a custom defined breakpoint', async () => {
      const sass = `
        @import "vendor/sass-mq";

        @include mq-add-breakpoint(tvscreen, 1920px);

        .hide-on-tv {
          @include mq(tvscreen) {
              display: none;
          }
        }`

      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe('@media (min-width: 120em){.hide-on-tv{display:none}}')
    })
  })

  describe('@mq-show-breakpoints mixin', () => {
    it('outputs all the specified breakpoints', async () => {
      const sass = `
        @import "vendor/sass-mq";
        @include mq-show-breakpoints((L, XL), (L: 800px, XL: 1200px));
        `
      const sassConfig = {
        includePaths: [ configPaths.src ],
        outputStyle: 'nested'
      }
      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css.toString()
        .trim())
        .toBe(outdent`
    @charset \"UTF-8\";
    body:before {
      background-color: #FCF8E3;
      border-bottom: 1px solid #FBEED5;
      border-left: 1px solid #FBEED5;
      color: #C09853;
      font: small-caption;
      padding: 3px 6px;
      pointer-events: none;
      position: fixed;
      right: 0;
      top: 0;
      z-index: 100; }
      @media (min-width: 50em) {
        body:before {
          content: \"L ≥ 800px (50em)\"; } }
      @media (min-width: 75em) {
        body:before {
          content: \"XL ≥ 1200px (75em)\"; } }`)
    })
  })

  describe('@mq mixin', () => {
    it('outputs "min-width" media query', async() => {
      const sass = `
        @import "vendor/sass-mq";

        .foo {
          @include mq($from: 20em) {
            color: red;
          }
        }`

      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe('@media (min-width: 20em){.foo{color:red}}')
    })

    it('outputs "max-width" media query', async() => {
      const sass = `
        @import "vendor/sass-mq";

        .foo {
          @include mq($until: 20em) {
            color: red;
          }
        }`

      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe('@media (max-width: 20em){.foo{color:red}}')
    })

    it('outputs "min-width" and max-width" media queries', async() => {
      const sass = `
        @import "vendor/sass-mq";

        .foo {
          @include mq(20em,40em) {
            color: red;
          }
        }`

      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe('@media (min-width: 20em) and (max-width: 40em){.foo{color:red}}')
    })

    it('outputs additional custom directives', async() => {
      const sass = `
        @import "vendor/sass-mq";

        .foo {
          @include mq($until:40em, $and:'(orientation: landscape)') {
            color: red;
          }
        }`

      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe('@media (max-width: 40em) and (orientation: landscape){.foo{color:red}}')
    })

    it('outputs the correct media type', async() => {
      const sass = `
        @import "vendor/sass-mq";

        .foo {
          @include mq($until:40em, $media-type: 'aural') {
            color: red;
          }
        }`

      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe('@media aural and (max-width: 40em){.foo{color:red}}')
    })

    it('only outputs static breakpoint styles', async() => {
      const sass = `
        $mq-breakpoints: (
          mobile:  320px,
          tablet:  740px,
          desktop: 980px,
          wide:    1300px
        );

        $mq-responsive: false;
        $mq-static-breakpoint: desktop;

        @import "vendor/sass-mq";

        .foo {
          @include mq($until: tablet) {
            color: lawngreen;
          }
          @include mq($from: desktop) {
              color: forestgreen;
          }
        }`

      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe('.foo{color:forestgreen}')
    })

    it('does not rasterize print queries', async() => {
      const sass = `
        $mq-responsive: false;

        @import "vendor/sass-mq";

        .foo {
          color: blue;
          @include mq($media-type: 'print') {
            color: red;
          }
        }`

      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe('.foo{color:blue}')
    })
  })
})
