import { readFile } from 'fs/promises'
import { join } from 'path'

import { paths, pkg } from 'govuk-frontend-config'
import { compileSassFile } from 'govuk-frontend-helpers/tests'
import { filterPath, getDirectories, getListing, mapPathTo } from 'govuk-frontend-lib/files'
import { componentNameToClassName, componentPathToModuleName } from 'govuk-frontend-lib/names'

describe('packages/govuk-frontend/dist/', () => {
  let listingSource
  let listingDist

  let componentsFilesSource
  let componentsFilesDist
  let componentsFilesDistESM

  let componentNames

  beforeAll(async () => {
    listingSource = await getListing(join(paths.package, 'src'))
    listingDist = await getListing(join(paths.package, 'dist'))

    componentsFilesSource = await getListing(join(paths.package, 'src/govuk/components'))
    componentsFilesDist = await getListing(join(paths.package, 'dist/govuk/components'))
    componentsFilesDistESM = await getListing(join(paths.package, 'dist/govuk-esm/components'))

    // Components list
    componentNames = await getDirectories(join(paths.package, 'src/govuk/components'))
  })

  it('should contain the expected files', async () => {
    const filterPatterns = [
      '!**/.DS_Store',
      '!**/*.test.*',
      '!**/__snapshots__/',
      '!**/__snapshots__/**',
      '!**/tsconfig?(.build).json'
    ]

    // Build array of expected output files
    const listingExpected = listingSource
      .filter(filterPath(filterPatterns))

      // Replaces GOV.UK Prototype kit config with JSON
      .flatMap(mapPathTo(['**/govuk-prototype-kit.config.mjs'], ({ dir: requirePath, name }) => [
        join(requirePath, '../', `${name}.json`)
      ]))

      // Replaces all source '*.mjs' files
      .flatMap(mapPathTo(['**/*.mjs'], ({ dir: requirePath, name }) => {
        const importFilter = /^govuk(?!-)/

        // All source `**/*.mjs` files compiled to `**/*.js`
        const output = [
          join(requirePath, `${name}.js`),
          join(requirePath, `${name}.js.map`) // with source map
        ]

        // Only source `./govuk/**/*.mjs` files compiled to `./govuk-esm/**/*.mjs`
        if (importFilter.test(requirePath)) {
          const importPath = requirePath.replace(importFilter, 'govuk-esm')

          output.push(...[
            join(importPath, `${name}.mjs`),
            join(importPath, `${name}.mjs.map`) // with source map
          ])
        }

        return output
      }))

      // Add Autoprefixer prefixes to all source '*.scss' files
      .flatMap(mapPathTo(['**/*.scss'], ({ dir: requirePath, name }) => [
        join(requirePath, `${name}.scss`),
        join(requirePath, `${name}.scss.map`) // with source map
      ]))

      // Replaces source component '*.yaml' with:
      // - `fixtures.json` fixtures for tests
      // - `macro-options.json` component options
      .flatMap(mapPathTo(['**/*.yaml'], ({ dir: requirePath }) => [
        join(requirePath, 'fixtures.json'),
        join(requirePath, 'macro-options.json')
      ]))

      // Files already present in 'package/dist'
      .concat(['package.json'])
      .sort()

    // Compare array of actual output files
    expect(listingDist).toEqual(listingExpected)
  })

  describe('README.md', () => {
    it('is not overwritten', async () => {
      const contents = await readFile(join(paths.package, 'dist/README.md'), 'utf8')

      // Look for H1 matching 'GOV.UK Frontend' from existing README
      expect(contents).toMatch(/^# GOV.UK Frontend/)
    })
  })

  describe('all.scss', () => {
    it('should compile without throwing an exception', async () => {
      const file = join(paths.package, 'dist/govuk/all.scss')
      await expect(compileSassFile(file)).resolves
    })
  })

  describe('all.js', () => {
    it('should have correct module name', async () => {
      const contents = await readFile(join(paths.package, 'dist/govuk/all.js'), 'utf8')

      // Look for AMD module definition for 'GOVUKFrontend'
      expect(contents).toContain("typeof define === 'function' && define.amd ? define('GOVUKFrontend', ['exports'], factory)")
    })

    it('should have correct version number', async () => {
      const contents = await readFile(join(paths.package, 'dist/govuk/all.js'), 'utf8')

      // Look for AMD module export 'GOVUKFrontend.version'
      expect(contents).toContain(`var version = '${pkg.version}';`)
      expect(contents).toContain('exports.version = version;')
    })
  })

  describe('component', () => {
    it('should have macro-options.json that contains JSON', () => {
      const componentTasks = componentNames.map(async (componentName) => {
        const componentFilter = filterPath([`**/${componentName}/**`])

        const componentSource = componentsFilesSource.filter(componentFilter)
        const componentDist = componentsFilesDist.filter(componentFilter)

        // File not found at source
        expect(componentSource)
          .toEqual(expect.not.arrayContaining([join(componentName, 'macro-options.json')]))

        // File generated in dist
        expect(componentDist)
          .toEqual(expect.arrayContaining([join(componentName, 'macro-options.json')]))

        const [optionsPath] = componentDist
          .filter(filterPath(['**/macro-options.json']))

        // Component options
        const options = JSON.parse(await readFile(join(paths.package, 'dist/govuk/components', optionsPath), 'utf8'))
        expect(options).toBeInstanceOf(Array)

        // Component options requirements
        const optionTasks = options.map(async (option) => expect(option).toEqual(
          expect.objectContaining({
            name: expect.stringMatching(/^[A-Z]+$/i),
            type: expect.stringMatching(/array|boolean|integer|string|object|nunjucks-block/),
            required: expect.any(Boolean),
            description: expect.any(String)
          })
        ))

        // Check all component options
        return Promise.all(optionTasks)
      })

      // Check all component files
      return Promise.all(componentTasks)
    })
  })

  describe('components with JavaScript', () => {
    let componentNamesWithJavaScript

    beforeAll(async () => {
      // Components list (with JavaScript only)
      componentNamesWithJavaScript = componentNames
        .filter((componentName) => componentsFilesSource.includes(join(componentName, `${componentName}.mjs`)))
    })

    it('should have component JavaScript file with correct module name', () => {
      const componentTasks = componentNamesWithJavaScript.map(async (componentName) => {
        const componentFilter = filterPath([`**/${componentName}/**`])

        const componentSource = componentsFilesSource.filter(componentFilter)
        const componentDist = componentsFilesDist.filter(componentFilter)
        const componentDistESM = componentsFilesDistESM.filter(componentFilter)

        // UMD module not found at source
        expect(componentSource)
          .toEqual(expect.not.arrayContaining([join(componentName, `${componentName}.js`)]))

        // UMD module generated in dist
        expect(componentDist)
          .toEqual(expect.arrayContaining([join(componentName, `${componentName}.js`)]))

        // ES module generated in dist
        expect(componentsFilesDistESM)
          .toEqual(expect.arrayContaining([join(componentName, `${componentName}.mjs`)]))

        const [modulePath] = componentDist
          .filter(filterPath([`**/${componentName}.js`]))

        const [modulePathESM] = componentDistESM
          .filter(filterPath([`**/${componentName}.mjs`]))

        const moduleName = componentPathToModuleName(join(paths.package, 'src/govuk/components', modulePath))
        const moduleText = await readFile(join(paths.package, 'dist/govuk/components', modulePath), 'utf8')
        const moduleTextESM = await readFile(join(paths.package, 'dist/govuk-esm/components', modulePathESM), 'utf8')

        expect(moduleText).toContain(`typeof define === 'function' && define.amd ? define('${moduleName}', factory)`)
        expect(moduleTextESM).toContain(`export default ${componentNameToClassName(componentName)}`)
      })

      // Check all component files
      return Promise.all(componentTasks)
    })
  })

  describe('fixtures', () => {
    it('should have fixtures.json that contains JSON', () => {
      const componentTasks = componentNames.map(async (componentName) => {
        const componentFilter = filterPath([`**/${componentName}/**`])

        const componentSource = componentsFilesSource.filter(componentFilter)
        const componentDist = componentsFilesDist.filter(componentFilter)

        // File not found at source
        expect(componentSource)
          .toEqual(expect.not.arrayContaining([join(componentName, 'fixtures.json')]))

        // File generated in dist
        expect(componentDist)
          .toEqual(expect.arrayContaining([join(componentName, 'fixtures.json')]))

        const [fixturesPath] = componentDist
          .filter(filterPath([`**/${componentName}/fixtures.json`]))

        // Component fixtures
        const { component, fixtures } = JSON.parse(await readFile(join(paths.package, 'dist/govuk/components', fixturesPath), 'utf8'))
        expect(component).toEqual(componentName)
        expect(fixtures).toBeInstanceOf(Array)

        // Component fixtures requirements
        const optionTasks = fixtures.map(async (fixture) => expect(fixture).toEqual(
          expect.objectContaining({
            name: expect.any(String),
            options: expect.any(Object),
            html: expect.any(String),
            hidden: expect.any(Boolean)
          })
        ))

        // Check all component fixtures
        return Promise.all(optionTasks)
      })

      // Check all component files
      return Promise.all(componentTasks)
    })
  })
})
