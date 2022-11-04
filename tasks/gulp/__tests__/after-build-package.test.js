const { readFile } = require('fs/promises')
const { join } = require('path')

const configPaths = require('../../../config/paths.js')
const { filterPath, getDirectories, getListing, mapPathTo } = require('../../../lib/file-helper')
const { componentNameToJavaScriptClassName, componentNameToJavaScriptModuleName } = require('../../../lib/helper-functions')

const { renderSass } = require('../../../lib/jest-helpers')

describe('package/', () => {
  let listingSource
  let listingPackage

  let componentsFilesSource
  let componentsFilesPackage
  let componentsFilesPackageESM

  let componentNames

  beforeAll(async () => {
    listingSource = await getListing(join(configPaths.src, '../'))
    listingPackage = await getListing(configPaths.package)

    componentsFilesSource = await getListing(configPaths.components)
    componentsFilesPackage = await getListing(join(configPaths.package, 'govuk/components'))
    componentsFilesPackageESM = await getListing(join(configPaths.package, 'govuk-esm/components'))

    // Components list
    componentNames = await getDirectories(configPaths.components)
  })

  it('should contain the expected files', async () => {
    const filterPatterns = [
      '!**/.DS_Store',
      '!**/*.test.*',
      '!**/__snapshots__/',
      '!**/__snapshots__/**',
      '!govuk/README.md'
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
        const output = [join(requirePath, `${name}.js`)]

        // Only source `./govuk/**/*.mjs` files copied to `./govuk-esm/**/*.mjs`
        if (importFilter.test(requirePath)) {
          output.push(join(requirePath.replace(importFilter, 'govuk-esm'), `${name}.mjs`))
        }

        return output
      }))

      // Replaces source component '*.yaml' with:
      // - `fixtures.json` fixtures for tests
      // - `macro-options.json` component options
      .flatMap(mapPathTo(['**/*.yaml'], ({ dir: requirePath }) => [
        join(requirePath, 'fixtures.json'),
        join(requirePath, 'macro-options.json')
      ]))

      // Files already present in 'package'
      .concat(...[
        'package.json',
        'README.md'
      ])
      .sort()

    // Compare array of actual output files
    expect(listingPackage).toEqual(listingExpected)
  })

  describe('README.md', () => {
    it('is not overwritten', () => {
      return readFile(join(configPaths.package, 'README.md'), 'utf8')
        .then(contents => {
          // Look for H1 matching 'GOV.UK Frontend' from existing README
          expect(contents).toMatch(/^# GOV.UK Frontend/)
        }).catch(error => {
          throw error
        })
    })
  })

  describe('all.scss', () => {
    it('should compile without throwing an exception', async () => {
      const allScssFile = join(configPaths.package, 'govuk', 'all.scss')
      await renderSass({ file: allScssFile })
    })
  })

  describe('all.js', () => {
    it('should have correct module name', async () => {
      const allJsFile = join(configPaths.package, 'govuk', 'all.js')

      return readFile(allJsFile, 'utf8')
        .then((data) => {
          expect(data).toContain("typeof define === 'function' && define.amd ? define('GOVUKFrontend', ['exports'], factory)")
        })
        .catch(error => {
          throw error
        })
    })
  })

  describe('component', () => {
    it('should have macro-options.json that contains JSON', () => {
      const componentTasks = componentNames.map(async (componentName) => {
        const componentFilter = filterPath([`${componentName}/**`])

        const componentSource = componentsFilesSource.filter(componentFilter)
        const componentPackage = componentsFilesPackage.filter(componentFilter)

        // File not found at source
        expect(componentSource)
          .toEqual(expect.not.arrayContaining([join(componentName, 'macro-options.json')]))

        // File generated in package
        expect(componentPackage)
          .toEqual(expect.arrayContaining([join(componentName, 'macro-options.json')]))

        const [optionsPath] = componentPackage
          .filter(filterPath(['**/macro-options.json']))

        // Component options
        const options = JSON.parse(await readFile(join(configPaths.package, 'govuk/components', optionsPath), 'utf8'))
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
        const componentFilter = filterPath([`${componentName}/**`])

        const componentSource = componentsFilesSource.filter(componentFilter)
        const componentPackage = componentsFilesPackage.filter(componentFilter)
        const componentPackageESM = componentsFilesPackageESM.filter(componentFilter)

        // CommonJS module not found at source
        expect(componentSource)
          .toEqual(expect.not.arrayContaining([join(componentName, `${componentName}.js`)]))

        // CommonJS generated in package
        expect(componentPackage)
          .toEqual(expect.arrayContaining([join(componentName, `${componentName}.js`)]))

        // ESM module generated in package
        expect(componentsFilesPackageESM)
          .toEqual(expect.arrayContaining([join(componentName, `${componentName}.mjs`)]))

        const [modulePath] = componentPackage
          .filter(filterPath([`**/${componentName}.js`]))

        const [modulePathESM] = componentPackageESM
          .filter(filterPath([`**/${componentName}.mjs`]))

        const moduleText = await readFile(join(configPaths.package, 'govuk/components', modulePath), 'utf8')
        const moduleTextESM = await readFile(join(configPaths.package, 'govuk-esm/components', modulePathESM), 'utf8')

        expect(moduleText).toContain(`typeof define === 'function' && define.amd ? define('${componentNameToJavaScriptModuleName(componentName)}', factory)`)
        expect(moduleTextESM).toContain(`export default ${componentNameToJavaScriptClassName(componentName)}`)
      })

      // Check all component files
      return Promise.all(componentTasks)
    })
  })

  describe('fixtures', () => {
    it('should have fixtures.json that contains JSON', () => {
      const componentTasks = componentNames.map(async (componentName) => {
        const componentFilter = filterPath([`${componentName}/**`])

        const componentSource = componentsFilesSource.filter(componentFilter)
        const componentPackage = componentsFilesPackage.filter(componentFilter)

        // File not found at source
        expect(componentSource)
          .toEqual(expect.not.arrayContaining([join(componentName, 'fixtures.json')]))

        // File generated in package
        expect(componentPackage)
          .toEqual(expect.arrayContaining([join(componentName, 'fixtures.json')]))

        const [fixturesPath] = componentPackage
          .filter(filterPath([`${componentName}/fixtures.json`]))

        // Component fixtures
        const { component, fixtures } = JSON.parse(await readFile(join(configPaths.package, 'govuk/components', fixturesPath), 'utf8'))
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
