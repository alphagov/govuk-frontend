import { paths } from '@govuk-frontend/config'
import { compileSassString } from '@govuk-frontend/helpers/tests'
import sassdoc from 'sassdoc'
import slash from 'slash'

describe('GOV.UK Frontend', () => {
  describe('global styles', () => {
    it('are disabled by default', async () => {
      const sass = `
        @import "all";
      `
      const results = compileSassString(sass)

      await expect(results).resolves.toMatchObject({
        css: expect.not.stringContaining('a, .govuk-link {')
      })

      await expect(results).resolves.toMatchObject({
        css: expect.not.stringContaining('p, .govuk-body, .govuk-body-m {')
      })
    })

    it('are enabled if $global-styles variable is set to true', async () => {
      const sass = `
        $govuk-global-styles: true;
        @import "all";
      `

      const results = compileSassString(sass)

      await expect(results).resolves.toMatchObject({
        css: expect.stringContaining('a, .govuk-link {')
      })

      await expect(results).resolves.toMatchObject({
        css: expect.stringContaining('p, .govuk-body, .govuk-body-m {')
      })
    })
  })

  // Sass functions will be automatically evaluated at compile time and the
  // return value from the function will be used in the compiled CSS.
  //
  // However, CSS has native 'function'-esque syntax as well
  // (e.g. `background-image: url(...)`) and so if you call a non-existent
  // function then Sass will just include it as part of your CSS. This means if
  // you rename a function, or accidentally include a typo in the function name,
  // these function calls can end up in the compiled CSS.
  //
  // Example:
  //
  //   @function govuk-double($number) {
  //     @return $number * 2;
  //   }
  //
  //   .my-class {
  //     height: govuk-double(10px);
  //     width: govuk-duoble(10px);
  //   }
  //
  // Rather than throwing an error, the compiled CSS would look like:
  //
  //   .my-class {
  //     height: 20px;
  //     width: govuk-duoble(10px); // intentional typo
  //   }
  //
  // This test attempts to match anything that looks like a function call within
  // the compiled CSS - if it finds anything, it will result in the test
  // failing.
  it('does not contain any unexpected govuk- function calls', async () => {
    const sass = '@import "all"'

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: expect.not.stringMatching(/_?govuk-[\w-]+\(.*?\)/g)
    })
  })

  describe('Sass documentation', () => {
    it('associates everything with a group', async () => {
      return sassdoc
        .parse([
          `${slash(paths.package)}/src/govuk/**/*.scss`,
          `!${slash(paths.package)}/src/govuk/vendor/*.scss`
        ])
        .then((docs) =>
          docs.forEach((doc) => {
            return expect(doc).toMatchObject({
              // Include doc.context.name in the expected result when this fails,
              // giving you the context to be able to fix it
              context: {
                name: doc.context.name
              },
              group: [expect.not.stringMatching('undefined')]
            })
          })
        )
    })
  })
})
