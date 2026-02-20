import { join } from 'node:path'

import { compileStringAsync, NodePackageImporter } from 'sass-embedded'

// To keep the output a little quiet, we'll silence a couple of things
/** @type {import("sass-embedded").StringOptions<"async">} */
const sassConfig = {
  quietDeps: true, // We're not interested in deprecation warnings from govuk-frontend
  silenceDeprecations: ['import'] // We're going to use the deprecated `@import`
}

describe('import-only files', () => {
  // Let's start with the modern syntax.
  // `@use` should load the `index.scss` file as you'd expect
  it('loads `index.scss` when using `@use`', async () => {
    const sass = `
      @use "file:${absolutePath('import-only-files')}";
    `

    const { css } = await compileStringAsync(sass, {
      ...sassConfig,
      importers: [new NodePackageImporter()]
    })

    // We'll find the expected selector in the output
    expect(css).toContain('.from-index')
  })

  // Because there's also an `index.import.scss` file
  // when using `@import` that's the one that'll actually be loaded
  it('loads `index.import.scss` when using `@import`', async () => {
    const sass = `
      @import "file:${absolutePath('import-only-files')}";
    `

    const { css } = await compileStringAsync(sass, {
      ...sassConfig,
      importers: [new NodePackageImporter()]
    })

    // We'll find the selector from the `@use`d index module
    expect(css).toContain('.from-index {')

    // as well as the comment specific from the `index.import.scss` file
    expect(css).toContain('.from-index.import {')
  })

  // When importing an import-only file that `@use`s a module
  // the CSS from the `@use`d module will be output as many times
  // as there are imports
  it('outputs the CSS of used modules as many times as imported', async () => {
    const sass = `
      @import "file:${absolutePath('import-only-files')}";
      @import "file:${absolutePath('import-only-files')}";
    `

    const { css } = await compileStringAsync(sass, {
      ...sassConfig,
      importers: [new NodePackageImporter()]
    })

    const occurrencesFromModule = Array.from(css.matchAll(/\.from-index \{/g))
    expect(occurrencesFromModule).toHaveLength(2)

    const occurrencesFromImportFile = Array.from(
      css.matchAll(/\.from-index\.import \{/g)
    )
    expect(occurrencesFromImportFile).toHaveLength(2)
  })

  // Using `@forward` inside an `import` only file allows configuration
  // to be received through global variables prior to import, like with
  // a regular imported file
  it('allows the module to be configured via global variables prior to import if it `@forward`s the module', async () => {
    const sass = `
      $colour: lime;
      @import "file:${absolutePath('import-only-files/forward')}";
    `

    const { css } = await compileStringAsync(sass, {
      ...sassConfig,
      importers: [new NodePackageImporter()]
    })

    // We'll find the selector from the `@use`d index module
    expect(css).toContain('--module-color: lime;')
  })

  // But if the internal module was `@use`s before, the global variable will
  // have no effect. This may happen when combining multiple libraries potentially
  // `@use`ing or `@forward`ing GOV.UK Frontend internally.
  it('uses configured values from `with` if module is already configured', async () => {
    const sass = `
      @use "file:${absolutePath('import-only-files/forward')}" with (
        $colour: red
      );

      $colour: lime;
      @import "file:${absolutePath('import-only-files/forward')}";
    `

    const { css } = await compileStringAsync(sass, {
      ...sassConfig,
      importers: [new NodePackageImporter()]
    })

    // The colour will be the one set by `@use` not the global prior to the import
    expect(css).toContain('--module-color: red;')
  })

  // When importing multiple times
  it('uses configured values from `with` if module is already configured', async () => {
    const sass = `
      $colour: lime;
      $import-colour: yellow;
      @import "file:${absolutePath('import-only-files/forward')}";

      $colour: red;
      $import-colour: purple;
      @import "file:${absolutePath('import-only-files/forward')}";
    `

    const { css } = await compileStringAsync(sass, {
      ...sassConfig,
      importers: [new NodePackageImporter()]
    })

    console.log(css)

    // The colour in the module will be the one set before the first import in both case
    const occurrencesFromModule = Array.from(
      css.matchAll(/--module-color: lime/g)
    )
    expect(occurrencesFromModule).toHaveLength(2)
    expect(css).not.toContain('--module-color: red;')

    // While the colour in the imported file will be affected by the change of variable
    expect(css).toContain('--import-color: yellow;')
    expect(css).toContain('--import-color: purple;')
  })

  // Using `@forward` the import only file can configure a prefix
  // for the internal module's function, mixins and variable names
  it("prefixes the module's public variables", async () => {
    const sass = `
      $prefix-colour: lime;
      @import "file:${absolutePath('import-only-files/forward-prefixed')}";
    `

    const { css } = await compileStringAsync(sass, {
      ...sassConfig,
      importers: [new NodePackageImporter()]
    })

    // We'll find the selector from the `@use`d index module
    expect(css).toContain('--module-color: lime;')
  })

  // The import only files also make a neat target for people that want
  // to use `as *` and drop the functions in the global scope, as a way
  // to ensure the functions have a consistent prefix
  it("prefixes the module's public variables", async () => {
    const sass = `
      @use "file:${absolutePath('import-only-files/forward-prefixed.import')}" as * with (
        $prefix-colour: lime
      );

      body {
        --main-color: #{$prefix-colour};
      }
    `

    const { css } = await compileStringAsync(sass, {
      ...sassConfig,
      importers: [new NodePackageImporter()]
    })

    // The internal module has been appropriately configured
    expect(css).toContain('--module-color: lime;')

    // And the $prefix-colour from the module has been exposed to the main file
    expect(css).toContain('--main-color: lime;')
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
