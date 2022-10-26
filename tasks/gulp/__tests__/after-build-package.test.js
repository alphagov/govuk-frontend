const { readFile } = require('fs/promises')
const path = require('path')
const recursive = require('recursive-readdir')
const glob = require('glob')

const configPaths = require('../../../config/paths.js')
const { getDirectories, getListing } = require('../../../lib/file-helper')
const { componentNameToJavaScriptClassName, componentNameToJavaScriptModuleName } = require('../../../lib/helper-functions')

const { renderSass } = require('../../../lib/jest-helpers')

describe('package/', () => {
  let componentsFilesSource
  let componentsFilesPackage
  let componentsFilesPackageESM

  let componentNames

  beforeAll(async () => {
    componentsFilesSource = await getListing(configPaths.components)
    componentsFilesPackage = await getListing(`${configPaths.package}govuk/components/`)
    componentsFilesPackageESM = await getListing(`${configPaths.package}govuk-esm/components/`)

    // Components list
    componentNames = [...(await getDirectories(configPaths.components)).keys()]
  })

  it('should contain the expected files', () => {
    // Build an array of the files that are present in the package directory.
    const actualPackageFiles = () => {
      return recursive(configPaths.package).then(
        files => {
          return files
            // Remove /package prefix from filenames
            .map(file => file.replace(/^package\//, ''))
            // Sort to make comparison easier
            .sort()
        },
        error => {
          console.error('Unable to get package files', error)
        }
      )
    }

    // Build an array of files we expect to be found in the package directory,
    // based on the contents of the src directory.
    const expectedPackageFiles = () => {
      const filesToIgnore = [
        '.DS_Store',
        '*.test.*',
        '*.yaml',
        '*.snap',
        '*/govuk/README.md'
      ]

      const additionalFilesNotInSrc = [
        'package.json',
        'govuk-prototype-kit.config.json',
        '**/macro-options.json',
        '**/fixtures.json',
        'README.md'
      ]

      return recursive(configPaths.src, filesToIgnore).then(
        files => {
          let filesNotInSrc = files
          // Use glob to generate an array of files that accounts for wildcards in filenames
          filesNotInSrc = glob.sync('{' + additionalFilesNotInSrc.join(',') + '}', { cwd: 'package' })

          return files
            .map(file => {
              // Remove /src prefix from filenames
              const fileWithoutSrc = file.replace(/^src\//, '')

              // Account for govuk-esm folder
              if (fileWithoutSrc.split('.').pop() === 'mjs') {
                const esmFile = fileWithoutSrc.replace('govuk/', 'govuk-esm/')
                const umdFile = fileWithoutSrc.replace('.mjs', '.js')

                return [umdFile, esmFile]
              } else {
                return fileWithoutSrc
              }
            })
            // Allow for additional files that are not in src
            .concat(filesNotInSrc)
            .flat()
            // Sort to make comparison easier
            .sort()
        },
        error => {
          console.error('Unable to get package files', error)
        }
      )
    }

    // Compare the expected directory listing with the files we expect
    // to be present
    return Promise.all([actualPackageFiles(), expectedPackageFiles()])
      .then(results => {
        const [actualPackageFiles, expectedPackageFiles] = results

        expect(actualPackageFiles).toEqual(expectedPackageFiles)
      })
  })

  describe('README.md', () => {
    it('is not overwritten', () => {
      return readFile(path.join(configPaths.package, 'README.md'), 'utf8')
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
      const allScssFile = path.join(configPaths.package, 'govuk', 'all.scss')
      await renderSass({ file: allScssFile })
    })
  })

  describe('all.js', () => {
    it('should have correct module name', async () => {
      const allJsFile = path.join(configPaths.package, 'govuk', 'all.js')

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
