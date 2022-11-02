const { readFile } = require('fs/promises')
const { join, normalize, parse } = require('path')
const minimatch = require('minimatch')
const slash = require('slash')

const configPaths = require('../../../config/paths.js')
const { getDirectories, getListing, listingToArray } = require('../../../lib/file-helper')
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
    listingSource = await getListing(configPaths.src)
    listingPackage = await getListing(configPaths.package)

    componentsFilesSource = await getListing(configPaths.components)
    componentsFilesPackage = await getListing(`${configPaths.package}govuk/components/`)
    componentsFilesPackageESM = await getListing(`${configPaths.package}govuk-esm/components/`)

    // Components list
    componentNames = [...(await getDirectories(configPaths.components)).keys()]
  })

  it('should contain the expected files', async () => {
    const filterPatterns = [
      '!**/.DS_Store',
      '!**/*.test.*',
      '!**/__snapshots__/',
      '!**/__snapshots__/**',
      `!${configPaths.src}README.md`
    ]

    // Build array of expected output files
    const filesExpected = [...listingSource]
      .flatMap(listingToArray)

      // Apply filters
      .filter((entryPath) => filterPatterns
        .every((pattern) => minimatch(entryPath, pattern, { matchBase: true })))

      // Each component '*.mjs' compiled to '*.js'
      .flatMap((entryPath) => {
        const isMatch = minimatch(entryPath, '**/*.mjs')

        if (isMatch) {
          const { dir: requirePath, name } = parse(entryPath)
          const importPath = normalize(slash(requirePath).replace('src/govuk', 'src/govuk-esm'))

          return [
            join(importPath, `${name}.mjs`),
            join(requirePath, `${name}.js`)
          ]
        }

        return entryPath
      })

      // Each component '*.yaml' output to '*.json'
      .flatMap((entryPath) => {
        const isMatch = minimatch(entryPath, `${configPaths.components}**/*.yaml`)

        if (isMatch) {
          const { dir } = parse(entryPath)

          return [
            join(dir, 'fixtures.json'),
            join(dir, 'macro-options.json')
          ]
        }

        return entryPath
      })

      // Files output from 'src' to 'package'
      .map((file) => normalize(slash(file).replace(/^src\//, 'package/')))

      // Files already present in 'package'
      .concat(...[
        normalize('package/govuk-prototype-kit.config.json'),
        normalize('package/package.json'),
        normalize('package/README.md')
      ])
      .sort()

    // Build array of actual output files
    const filesActual = [...listingPackage]
      .flatMap(listingToArray)
      .sort()

      // Apply filters
      .filter((entryPath) => filterPatterns
        .every((pattern) => minimatch(entryPath, pattern, { matchBase: true })))

    expect(filesActual).toEqual(filesExpected)
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
        const componentSource = componentsFilesSource.get(componentName).entries
        const componentPackage = componentsFilesPackage.get(componentName).entries

        // File not found at source
        expect([...componentSource.keys()])
          .toEqual(expect.not.arrayContaining(['macro-options.json']))

        // File generated in package
        expect([...componentPackage.keys()])
          .toEqual(expect.arrayContaining(['macro-options.json']))

        const { path } = componentPackage.get('macro-options.json')

        // Component options
        const options = JSON.parse(await readFile(path, 'utf8'))
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
    beforeEach(async () => {
      // Filter "JavaScript enabled" only
      componentNames = [...componentsFilesSource]
        .filter(([name, { listing }]) => listing?.has(`${name}.mjs`))
        .map(([name]) => name)
    })

    it('should have component JavaScript file with correct module name', () => {
      const componentTasks = componentNames.map(async (componentName) => {
        const componentSource = componentsFilesSource.get(componentName).entries
        const componentPackage = componentsFilesPackage.get(componentName).entries
        const componentPackageESM = componentsFilesPackageESM.get(componentName).entries

        // CommonJS module not found at source
        expect([...componentSource.keys()])
          .toEqual(expect.not.arrayContaining([`${componentName}.js`]))

        // CommonJS generated in package
        expect([...componentPackage.keys()])
          .toEqual(expect.arrayContaining([`${componentName}.js`]))

        // ESM module generated in package
        expect([...componentPackageESM.keys()])
          .toEqual(expect.arrayContaining([`${componentName}.mjs`]))

        const { path: modulePath } = componentPackage.get(`${componentName}.js`)
        const { path: modulePathESM } = componentPackageESM.get(`${componentName}.mjs`)

        const moduleText = await readFile(modulePath, 'utf8')
        const moduleTextESM = await readFile(modulePathESM, 'utf8')

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
        const componentSource = componentsFilesSource.get(componentName).entries
        const componentPackage = componentsFilesPackage.get(componentName).entries

        // File not found at source
        expect([...componentSource.keys()])
          .toEqual(expect.not.arrayContaining(['fixtures.json']))

        // File generated in package
        expect([...componentPackage.keys()])
          .toEqual(expect.arrayContaining(['fixtures.json']))

        const { path } = componentPackage.get('fixtures.json')

        // Component fixtures
        const { component, fixtures } = JSON.parse(await readFile(path, 'utf8'))
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
