import { readFile } from 'fs/promises'
import { join } from 'path'

import { paths, pkg } from '@govuk-frontend/config'
import { compileSassFile } from '@govuk-frontend/helpers/tests'
import {
  getComponentNames,
  getComponentNamesFiltered
} from '@govuk-frontend/lib/components'
import { filterPath, getListing, mapPathTo } from '@govuk-frontend/lib/files'
import { componentNameToClassName } from '@govuk-frontend/lib/names'
import { outdent } from 'outdent'

describe('packages/govuk-frontend/dist/', () => {
  let listingPackage
  let listingSource
  let listingDist

  let componentsFilesSource
  let componentsFilesDist

  let componentNames
  let componentNamesWithJavaScript

  beforeAll(async () => {
    listingPackage = await getListing('*', {
      cwd: paths.package
    })

    listingSource = await getListing('**/*', {
      cwd: join(paths.package, 'src')
    })

    listingDist = await getListing('**/*', {
      cwd: join(paths.package, 'dist')
    })

    componentsFilesSource = await getListing('**/*', {
      cwd: join(paths.package, 'src/govuk/components')
    })

    componentsFilesDist = await getListing('**/*', {
      cwd: join(paths.package, 'dist/govuk/components')
    })

    // Components list
    componentNames = await getComponentNames()

    // Components list (with JavaScript only)
    componentNamesWithJavaScript = await getComponentNamesFiltered(
      (componentName, componentFiles) =>
        componentFiles.some(filterPath([`**/${componentName}.mjs`]))
    )
  })

  it('should contain the expected files', async () => {
    const filterPatterns = [
      '!**/.DS_Store',
      '!**/*.test.*',
      '!**/__snapshots__/',
      '!**/__snapshots__/**',
      '!**/tsconfig?(.build).json',
      '!README.md'
    ]

    // Build array of expected output files
    const listingExpected = listingSource
      .filter(filterPath(filterPatterns))

      // Removes GOV.UK Prototype kit config (moved to package top level)
      .flatMap(mapPathTo(['**/govuk-prototype-kit.config.mjs'], () => []))

      // All source `**/*.mjs` files compiled to ES modules
      .flatMap(
        mapPathTo(['**/*.mjs'], ({ dir: requirePath, name }) => [
          join(requirePath, `${name}.mjs`),
          join(requirePath, `${name}.mjs.map`) // with source map
        ])
      )

      // Only package entries and components are compiled to ES module + UMD bundles
      .flatMap(
        mapPathTo(
          ['**/govuk/{all,components/**/*}.mjs'],
          ({ dir: requirePath, name }) => [
            join(requirePath, `${name}.mjs`),

            // UMD bundles for compatibility (e.g. Rails Asset Pipeline)
            join(requirePath, `${name}.bundle.js`),
            join(requirePath, `${name}.bundle.js.map`), // with source map

            // ES module bundles for browsers
            join(requirePath, `${name}.bundle.mjs`),
            join(requirePath, `${name}.bundle.mjs.map`) // with source map
          ]
        )
      )

      // Only main package entry is compiled to minified ES module bundle
      .flatMap(
        mapPathTo(['**/govuk/all.mjs'], ({ dir: requirePath }) => [
          join(requirePath, 'all.mjs'),

          // ES module bundles for browsers, minified
          join(requirePath, 'govuk-frontend.min.js'), // avoid .mjs extension MIME issues
          join(requirePath, 'govuk-frontend.min.js.map') // with source map
        ])
      )

      // Only sass package entry is compiled to minified CSS bundle
      .flatMap(
        mapPathTo(['**/govuk/all.scss'], ({ dir: requirePath }) => [
          join(requirePath, 'all.scss'),

          // CSS bundle, minified
          join(requirePath, 'govuk-frontend.min.css'),
          join(requirePath, 'govuk-frontend.min.css.map') // with source map
        ])
      )

      // Add Autoprefixer prefixes to all source '*.scss' files
      .flatMap(
        mapPathTo(['**/*.scss'], ({ dir: requirePath, name }) => [
          join(requirePath, `${name}.scss`),
          join(requirePath, `${name}.scss.map`) // with source map
        ])
      )

      // Replaces source component '*.yaml' with:
      // - `fixtures.json` fixtures for tests
      // - `macro-options.json` component options
      .flatMap(
        mapPathTo(['**/*.yaml'], ({ dir: requirePath }) => [
          join(requirePath, 'fixtures.json'),
          join(requirePath, 'macro-options.json')
        ])
      )
      .sort()

    // Compare output files with '.npmignore' filter
    const listingDistIgnored = listingDist.filter(
      filterPath(['!**/*.html', '!**/*.test.*'])
    )

    expect(listingDistIgnored).toEqual(listingExpected)

    // Check top level package contents
    expect(listingPackage).toEqual([
      'README.md',
      'babel.config.js',
      'govuk-prototype-kit.config.json',
      'gulpfile.mjs',
      'package.json',
      'package.json.unit.test.mjs',
      'postcss.config.mjs',
      'postcss.config.unit.test.mjs',
      'rollup.publish.config.mjs',
      'rollup.release.config.mjs',
      'tsconfig.build.json',
      'tsconfig.dev.json',
      'tsconfig.json'
    ])
  })

  describe('Sass stylesheets', () => {
    describe('all.scss', () => {
      it('should compile without throwing an exception', async () => {
        const file = join(paths.package, 'dist/govuk/all.scss')
        await expect(compileSassFile(file)).resolves.not.toThrow()
      })
    })
  })

  describe('ECMAScript (ES) modules', () => {
    describe('all.mjs', () => {
      it('should export each module', async () => {
        const contents = await readFile(
          join(paths.package, 'dist/govuk/all.mjs'),
          'utf8'
        )

        // Look for ES import for each component
        expect(contents).toContain(outdent`
          import { Accordion } from './components/accordion/accordion.mjs';
          import { Button } from './components/button/button.mjs';
          import { CharacterCount } from './components/character-count/character-count.mjs';
          import { Checkboxes } from './components/checkboxes/checkboxes.mjs';
          import { ErrorSummary } from './components/error-summary/error-summary.mjs';
          import { ExitThisPage } from './components/exit-this-page/exit-this-page.mjs';
          import { Header } from './components/header/header.mjs';
          import { NotificationBanner } from './components/notification-banner/notification-banner.mjs';
          import { PasswordInput } from './components/password-input/password-input.mjs';
          import { Radios } from './components/radios/radios.mjs';
          import { SkipLink } from './components/skip-link/skip-link.mjs';
          import { Tabs } from './components/tabs/tabs.mjs';
        `)

        // Look for ES modules named exports
        expect(contents).toContain(
          'export { Accordion, Button, CharacterCount, Checkboxes, ErrorSummary, ExitThisPage, Header, NotificationBanner, PasswordInput, Radios, SkipLink, Tabs, initAll };'
        )
      })
    })

    describe('common/govuk-frontend-version.mjs', () => {
      it('should have correct version number', async () => {
        const contents = await readFile(
          join(paths.package, 'dist/govuk/common/govuk-frontend-version.mjs'),
          'utf8'
        )

        // Look for ES modules `version` named export
        expect(contents).toContain(`const version = '${pkg.version}';`)
        expect(contents).toContain('export { version };')
      })
    })
  })

  describe('Universal Module Definition (UMD)', () => {
    describe('all.bundle.js', () => {
      it('should export each module', async () => {
        const contents = await readFile(
          join(paths.package, 'dist/govuk/all.bundle.js'),
          'utf8'
        )

        // Look for AMD module definition for 'GOVUKFrontend'
        expect(contents).toContain(
          "(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.GOVUKFrontend = {}));"
        )

        // Look for bundled components with CommonJS named exports
        for (const componentName of componentNamesWithJavaScript) {
          const componentClassName = componentNameToClassName(componentName)

          expect(contents).toContain(
            // Trailing space is important to not match `class ${componentClassName}Something`
            `class ${componentClassName} `
          )
          expect(contents).toContain(
            `exports.${componentClassName} = ${componentClassName};`
          )
        }

        // Look for CommonJS named exports for utilities
        expect(contents).toContain('exports.initAll = initAll;')
        expect(contents).toContain('exports.version = version;')
      })
    })
  })

  describe('Components', () => {
    it('should have macro-options.json that contains JSON', () => {
      const componentTasks = componentNames.map(async (componentName) => {
        const componentFilter = filterPath([`**/${componentName}/**`])

        const componentSource = componentsFilesSource.filter(componentFilter)
        const componentDist = componentsFilesDist.filter(componentFilter)

        // File not found at source
        expect(componentSource).toEqual(
          expect.not.arrayContaining([
            join(componentName, 'macro-options.json')
          ])
        )

        // File generated in dist
        expect(componentDist).toEqual(
          expect.arrayContaining([join(componentName, 'macro-options.json')])
        )

        const [optionsPath] = componentDist.filter(
          filterPath(['**/macro-options.json'])
        )

        // Component options
        const options = JSON.parse(
          await readFile(
            join(paths.package, 'dist/govuk/components', optionsPath),
            'utf8'
          )
        )
        expect(options).toBeInstanceOf(Array)

        // Component options requirements
        const optionTasks = options.map(async (option) =>
          expect(option).toEqual(
            expect.objectContaining({
              name: expect.stringMatching(/^[A-Z]+$/i),
              type: expect.stringMatching(
                /array|boolean|integer|string|object|nunjucks-block/
              ),
              required: expect.any(Boolean),
              description: expect.any(String)
            })
          )
        )

        // Check all component options
        return Promise.all(optionTasks)
      })

      // Check all component files
      return Promise.all(componentTasks)
    })
  })

  describe('Components with JavaScript', () => {
    it('should have component JavaScript file with correct module name', () => {
      const componentTasks = componentNamesWithJavaScript.map(
        async (componentName) => {
          const componentFilter = filterPath([`**/${componentName}/**`])

          const componentClassName = componentNameToClassName(componentName)

          const componentSource = componentsFilesSource.filter(componentFilter)
          const componentDist = componentsFilesDist.filter(componentFilter)

          // UMD bundle not found at source
          expect(componentSource).toEqual(
            expect.not.arrayContaining([
              join(componentName, `${componentName}.bundle.js`)
            ])
          )

          // ES modules and UMD bundle generated in dist
          expect(componentDist).toEqual(
            expect.arrayContaining([
              join(componentName, `${componentName}.mjs`),
              join(componentName, `${componentName}.bundle.js`)
            ])
          )

          const [modulePathESM] = componentDist.filter(
            filterPath([`**/${componentName}.mjs`])
          )

          const [modulePathUMD] = componentDist.filter(
            filterPath([`**/${componentName}.bundle.js`])
          )

          const moduleTextESM = await readFile(
            join(paths.package, 'dist/govuk/components', modulePathESM),
            'utf8'
          )
          const moduleTextUMD = await readFile(
            join(paths.package, 'dist/govuk/components', modulePathUMD),
            'utf8'
          )

          expect(moduleTextESM).toContain(`export { ${componentClassName} }`)
          expect(moduleTextUMD).toContain(
            `exports.${componentClassName} = ${componentClassName};`
          )
        }
      )

      // Check all component files
      return Promise.all(componentTasks)
    })
  })

  describe('Fixtures', () => {
    it('should have fixtures.json that contains JSON', () => {
      const componentTasks = componentNames.map(async (componentName) => {
        const componentFilter = filterPath([`**/${componentName}/**`])

        const componentSource = componentsFilesSource.filter(componentFilter)
        const componentDist = componentsFilesDist.filter(componentFilter)

        // File not found at source
        expect(componentSource).toEqual(
          expect.not.arrayContaining([join(componentName, 'fixtures.json')])
        )

        // File generated in dist
        expect(componentDist).toEqual(
          expect.arrayContaining([join(componentName, 'fixtures.json')])
        )

        const [fixturesPath] = componentDist.filter(
          filterPath([`**/${componentName}/fixtures.json`])
        )

        // Component fixtures
        const { component, fixtures } = JSON.parse(
          await readFile(
            join(paths.package, 'dist/govuk/components', fixturesPath),
            'utf8'
          )
        )
        expect(component).toEqual(componentName)
        expect(fixtures).toBeInstanceOf(Array)

        // Component fixtures requirements
        const optionTasks = fixtures.map(async (fixture) =>
          expect(fixture).toEqual(
            expect.objectContaining({
              name: expect.any(String),
              options: expect.any(Object),
              html: expect.any(String),
              hidden: expect.any(Boolean)
            })
          )
        )

        // Check all component fixtures
        return Promise.all(optionTasks)
      })

      // Check all component files
      return Promise.all(componentTasks)
    })
  })
})
