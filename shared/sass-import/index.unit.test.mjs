///
// This test file showcases what happens when using `pkg` to load the whole of
// `govuk-frontend` using various file paths and methods of loading (`@import`,
// `@use` or `@forward`)
///

// As we want the compilation to work the same as for a user
// we'll use the native exports from `sass-embedded`
// rather than the compilation helpers in `shared/helpers`
import { join } from 'node:path'

import { compileStringAsync, NodePackageImporter } from 'sass-embedded'

// To keep the output a little quiet, we'll silence a couple of things though`
/** @type {import("sass-embedded").StringOptions<"async">} */
const sassConfig = {
  quietDeps: true, // We're not interested in deprecation warnings from govuk-frontend
  silenceDeprecations: ['import'] // We're going to use the deprecated `@import`
}

describe('pkg:govuk-frontend', () => {
  // First thing: resolving `pkg:` URLs is not enabled by default
  // Sass won't be able to resolve the path in the following test
  describe('without specific `importers` configuration', () => {
    it('does not find the package', async () => {
      const sass = `
        @import "pkg:govuk-frontend";
      `

      expect(compileStringAsync(sass, { ...sassConfig })).rejects.toThrow(
        "Can't find stylesheet to import"
      )
    })
  })

  // Now with the proper configuration, let's see what happens
  // with various ways of loading GOV.UK Frontend
  describe('with `NodePackageImporter`', () => {
    // First let's just try to load the css and use one of the functions
    describe('Without configuration', () => {
      // `pkg:` URLs work not only with recent features like `@use`
      // but also with `@import`. This makes functions, mixins and variables
      //  of GOV.UK Frontend available in the global scope
      //
      // The `pkg:govuk-frontend` is resolved to the `dist/govuk/index.scss` file
      // thanks to the `exports` field in `govuk-frontend`'s `package.json`,
      // not the `sass` field (try putting a dummy file in the `sass` field,
      // compilation keeps working).
      it('resolves with `@import`', async () => {
        const sass = `
          @import "pkg:govuk-frontend";

          body {
            --color: #{govuk-colour('blue')};
          }
        `

        const { css } = await compileStringAsync(sass, {
          ...sassConfig,
          importers: [new NodePackageImporter()]
        })

        // Check that GOV.UK Frontend's style are output
        expect(css).toContain('.govuk-template')

        // And that the functions work correctly
        expect(css).toContain('--color: #1d70b8;')
      })

      // With `@use`, accessing functions, variables and mixins
      // needs to happen through the namespace
      // https://sass-lang.com/documentation/at-rules/use/
      it('resolves with `@use`', async () => {
        const sass = `
          @use "pkg:govuk-frontend";

          body {
            --color: #{govuk-frontend.govuk-colour('blue')};
          }
        `

        const { css } = await compileStringAsync(sass, {
          ...sassConfig,
          importers: [new NodePackageImporter()]
        })

        // Check that GOV.UK Frontend's style are output
        expect(css).toContain('.govuk-template')

        // And that the functions work correctly
        expect(css).toContain('--color: #1d70b8;')
      })

      // The namespace to use will be the last part of the path being `@use`d
      // This means people targetting directly the `dist/govuk/index.scss` file
      // will need to use `govuk` rather than `govuk-frontend`
      it('resolves with `@use` and the path to the index file', async () => {
        const sass = `
          @use "pkg:govuk-frontend/dist/govuk";

          body {
            --color: #{govuk.govuk-colour('blue')};
          }
        `

        const { css } = await compileStringAsync(sass, {
          ...sassConfig,
          importers: [new NodePackageImporter()]
        })

        // Check that GOV.UK Frontend's style are output
        expect(css).toContain('.govuk-template')

        // And that the functions work correctly
        expect(css).toContain('--color: #1d70b8;')
      })

      // That being said, the namespace is really up to the user
      // as they can use `as` to give an arbitrary name
      it('resolves with `@use` and alias', async () => {
        const sass = `
          @use "pkg:govuk-frontend" as govuk;

          body {
            --color: #{govuk.govuk-colour('blue')};
          }
        `

        const { css } = await compileStringAsync(sass, {
          ...sassConfig,
          importers: [new NodePackageImporter()]
        })

        // Check that GOV.UK Frontend's style are output
        expect(css).toContain('.govuk-template')

        // And that the functions work correctly
        expect(css).toContain('--color: #1d70b8;')
      })

      // And they can also choose to make GOV.UK Frontend's functions, mixins and variables
      // global in their modules using `as *`.
      it('resolves with `@use` and global alias', async () => {
        const sass = `
          @use "pkg:govuk-frontend" as *;

          body {
            --color: #{govuk-colour('blue')};
          }
        `

        const { css } = await compileStringAsync(sass, {
          ...sassConfig,
          importers: [new NodePackageImporter()]
        })

        // Check that GOV.UK Frontend's style are output
        expect(css).toContain('.govuk-template')

        // And that the functions work correctly
        expect(css).toContain('--color: #1d70b8;')
      })

      // If the `as *` is used within a module, the functions, mixins and variables
      // are only global within the module itself, not the modules that import them
      //
      // The `use-global-alias.scss` file `@use`s GOV.UK Frontend using `as *`,
      // but the functions, mixins and variables of GOV.UK Frontend won't be available
      // within the module `@use`ing `use-global-alias`.
      it('resolves with `@use` but does not leak globals', async () => {
        const sass = `
          @use 'file:${absolutePath('use-global-alias')}';

          body {
            --color: #{govuk-colour('blue')};
          }
        `
        // Because of how Sass treats functions, the compilation will still go through OK
        const { css } = await compileStringAsync(sass, {
          ...sassConfig,
          importers: [new NodePackageImporter()]
        })

        // GOV.UK Frontend's styles will be output as expected
        expect(css).toContain('.govuk-template')

        // As will the styles from within the `@use`d module
        expect(css).toContain('--color: #ca357c;')

        // But the `govuk-colour` function is not available in the module that `@use`s
        expect(css).toContain('govuk-colour("blue")')
      })

      // Modules can expose functions, mixins and variables from other modules
      // using another at-rule: `@forward`
      //
      // The `forward-index.scss` file "forwards" `govuk-frontend`
      // making the public functions, mixins and variables of GOV.UK Frontend
      // available as if they were coming from `forward-index`
      //
      // Note that forward will not only forward the public functions, mixins and variables
      // but also output the CSS like `@use` would
      // https://sass-lang.com/documentation/at-rules/forward/
      it('resolves with `@forward`', async () => {
        const sass = `
          @use 'file:${absolutePath('forward-index')}';

          body {
            --color: #{forward-index.govuk-colour('blue')};
          }
        `

        const { css } = await compileStringAsync(sass, {
          ...sassConfig,
          importers: [new NodePackageImporter()]
        })

        // Check that GOV.UK Frontend's style are output
        expect(css).toContain('.govuk-template')

        // And that the functions work correctly
        expect(css).toContain('--color: #1d70b8;')
      })

      // Modules using `@forward` can prefix the functions, mixins and variables
      // from the module they forward with `as`.
      //
      // The `forward-index-prefixed` module forwards GOV.UK Frontend,
      // adding a `govuk-design-system` prefix to the names (nevermind the verbosity XD)
      it('resolves with `@forward` and prefix', async () => {
        const sass = `
          @use 'file:${absolutePath('forward-index-prefixed')}';

          body {
            --color: #{forward-index-prefixed.govuk-design-system-govuk-colour('blue')};
          }
        `

        const { css } = await compileStringAsync(sass, {
          ...sassConfig,
          importers: [new NodePackageImporter()]
        })

        // Check that GOV.UK Frontend's style are output
        expect(css).toContain('.govuk-template')

        // And that the functions work correctly
        expect(css).toContain('--color: #1d70b8;')
      })

      // With only `@forward` the code inside a module cannot use
      // the features of the forwarded module in its own code
      it('resolves with `@forward` but shows you cannot call', async () => {
        const sass = `
          @use 'file:${absolutePath('forward-index-call')}';
        `

        await expect(
          compileStringAsync(sass, {
            ...sassConfig,
            importers: [new NodePackageImporter()]
          })
        ).rejects.toThrow(
          'There is no module with the namespace "govuk-frontend"'
        )
      })

      // A module wanting to use the code of the `@forward`ed module
      // needs to double it up with an `@use`
      it('resolves with `@forward` but shows you cannot call', async () => {
        const sass = `
          @use 'file:${absolutePath('forward-index-use')}';

          body {
            --color: #{forward-index-use.govuk-colour(red)};
          }
        `

        const { css } = await compileStringAsync(sass, {
          ...sassConfig,
          importers: [new NodePackageImporter()]
        })

        // Check that GOV.UK Frontend's style are output
        expect(css).toContain('.govuk-template')

        // And that the functions work correctly in the module that forwards
        expect(css).toContain('--color: #1d70b8;')

        // And after `@use`ing the module that forwards
        expect(css).toContain('--color: #ca3535;')
      })
    })

    // Now let's see how the Sass module system affects configuration
    describe('With configuration', () => {
      // With `@import` users can set global variables
      // and they'll get picked up by GOV.UK Frontend
      it('uses global variables with `@import`', async () => {
        const sass = `
          $govuk-functional-colours: (brand: hotpink);
          @import "pkg:govuk-frontend";

          body {
            --color: #{govuk-functional-colour(brand)};
          }
        `

        const { css } = await compileStringAsync(sass, {
          ...sassConfig,
          importers: [new NodePackageImporter()]
        })

        // Check that GOV.UK Frontend's style are output
        expect(css).toContain('.govuk-template')

        // And that the configuration happened
        expect(css).toContain('--color: var(--govuk-brand-colour, hotpink);')
      })

      // With `@use` global variables won't affect GOV.UK Frontend's configuration
      // The code of the `@use`d module is isolated
      it('ignores global variables with `@use`', async () => {
        const sass = `
          $govuk-functional-colours: (brand: hotpink);
          @use "pkg:govuk-frontend";

          body {
            --color: #{govuk-frontend.govuk-functional-colour(brand)};
          }
        `

        const { css } = await compileStringAsync(sass, {
          ...sassConfig,
          importers: [new NodePackageImporter()]
        })

        // Check that GOV.UK Frontend's style are output
        expect(css).toContain('.govuk-template')

        // !! Oh no !! The brand colour remains GOV.UK blue
        expect(css).toContain('--color: var(--govuk-brand-colour, #1d70b8);')
      })

      // To configure GOV.UK Frontend, users will need to use `with`
      it('accepts configuration through `with`', async () => {
        const sass = `
          @use "pkg:govuk-frontend" with (
            $govuk-functional-colours: (brand: hotpink)
          );

          body {
            --color: #{govuk-frontend.govuk-functional-colour(brand)};
          }
        `

        const { css } = await compileStringAsync(sass, {
          ...sassConfig,
          importers: [new NodePackageImporter()]
        })

        // Check that GOV.UK Frontend's style are output
        expect(css).toContain('.govuk-template')

        // **The brand colour remains GOV.UK blue
        expect(css).toContain('--color: var(--govuk-brand-colour, hotpink);')
      })

      // `with` can also be used with `@forward`, which is great news
      // for libraries that may want to wrap GOV.UK Frontend and offer
      // a pre-configured version to their users
      it('configures in `@forward`', async () => {
        const sass = `
          @use 'file:${absolutePath('forward-and-configure')}';

          body {
            --color: #{forward-and-configure.govuk-functional-colour(brand)};
          }
        `

        const { css } = await compileStringAsync(sass, {
          ...sassConfig,
          importers: [new NodePackageImporter()]
        })

        // Check that GOV.UK Frontend's style are output
        expect(css).toContain('.govuk-template')

        // **The brand colour remains GOV.UK blue
        expect(css).toContain('--color: var(--govuk-brand-colour, hotpink);')
      })

      // Using `!default` in the `@forward`ed package allows to
      // use `with` to pass the configuration down to the forwarded module
      it('forwards configuration', async () => {
        const sass = `
          @use 'file:${absolutePath('forward-configuration')}' with (
            $govuk-functional-colours: (
              brand: rebeccapurple
            )
          );

          body {
            --color: #{forward-configuration.govuk-functional-colour(brand)};
          }
        `

        const { css } = await compileStringAsync(sass, {
          ...sassConfig,
          importers: [new NodePackageImporter()]
        })

        // Check that GOV.UK Frontend's style are output
        expect(css).toContain('.govuk-template')

        // The colour is the one set when `@use`ing the module that uses `@forward`
        expect(css).toContain(
          '--color: var(--govuk-brand-colour, rebeccapurple);'
        )
      })

      // However, because modules are only loaded once, a module wrapping GOV.UK Frontend
      // and configuring it will also affect modules consuming `pkg:govuk-frontend`
      it('configures inside `@use`d module', async () => {
        const sass = `
          @use 'file:${absolutePath('use-and-configure')}';
          @use 'pkg:govuk-frontend';

          body {
            // We'll use a different property in the main code
            --background-color: #{govuk-frontend.govuk-functional-colour(brand)};
          }
        `

        const { css } = await compileStringAsync(sass, {
          ...sassConfig,
          importers: [new NodePackageImporter()]
        })

        // Check that GOV.UK Frontend's style are output
        expect(css).toContain('.govuk-template')

        // The brand colour inside the `@use`d module is configured
        expect(css).toContain('--color: var(--govuk-brand-colour, hotpink);')

        // The brand colour is also configured when using `govuk-frontend`
        expect(css).toContain(
          '--background-color: var(--govuk-brand-colour, hotpink);'
        )
      })

      // Thankfully Sass will error if a module tries to use `with` on a module
      // that's already loaded. It's more a concern for authors of libraries wrapping
      // GOV.UK Frontend, though.
      it('use govuk-frontend before using module', async () => {
        const sass = `
          @use 'pkg:govuk-frontend';
          @use 'file:${absolutePath('use-and-configure')}';


          body {
            // We'll use a different property in the main code
            --background-color: #{govuk-frontend.govuk-functional-colour(brand)};
          }
        `

        await expect(
          compileStringAsync(sass, {
            ...sassConfig,
            importers: [new NodePackageImporter()]
          })
        ).rejects.toThrow(
          `This module was already loaded, so it can't be configured using "with".`
        )
      })

      // Now what happens if the configuration happens on an individual file
      // of GOV.UK Frontend. If we configure `settings/colours-functional`,
      // will it affect a separate `@use` of `govuk-frontend`?
      it('configures govuk-frontend module', async () => {
        const sass = `
          @use "sass:map";

          @use 'pkg:govuk-frontend/dist/govuk/settings/colours-functional' with (
            $govuk-functional-colours: (
              brand: hotpink
            )
          );
          @use 'pkg:govuk-frontend';

          body {
            --from-govuk-frontend: #{govuk-frontend.govuk-functional-colour(brand)};

            // Let's check what's in the configured module as well
            --from-settings: #{map.get(colours-functional.$govuk-functional-colours, brand)};
          }
        `

        const { css } = await compileStringAsync(sass, {
          ...sassConfig,
          importers: [new NodePackageImporter()]
        })

        // Despite the configuration having affected the `colours-functional` file
        expect(css).toContain('--from-settings: hotpink')

        // The brand colour inside `govuk-frontend` hasn't been updated
        expect(css).toContain(
          '--from-govuk-frontend: var(--govuk-brand-colour, #1d70b8);'
        )
      })

      // Once we move `govuk-frontend` to use `@use` under the hood
      // `@use`ing and configuring individual files will also apply the changes
      // to the files in `govuk-frontend` that `@use` them as well
      it('configures through individual files', async () => {
        const sass = `
          @use "file:${absolutePath('configure-individual-files/settings')}" with (
            $colour: rebeccapurple
          );
          @use "file:${absolutePath('configure-individual-files')}";
        `

        const { css } = await compileStringAsync(sass, {
          ...sassConfig,
          importers: [new NodePackageImporter()]
        })

        // Despite the configuration having affected the `colours-functional` file
        expect(css).toContain('--from-settings: rebeccapurple')
      })
    })
  })
})

/**
 * Gets the absolute path of a file in the workspace
 *
 * @param {string} fileInWorkspace
 * @returns {string} The absolute path of the file within the workspace
 */
function absolutePath(fileInWorkspace) {
  // Despite being a Node module (which should us `import.meta.dirname`)
  // this file is executed by Jest so needs to use `__dirname` as tests run
  // as CommonJS modules
  // eslint-disable-next-line no-undef
  return join(__dirname, fileInWorkspace)
}
