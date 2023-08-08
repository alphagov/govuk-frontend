import { join, relative } from 'path'

import { paths } from 'govuk-frontend-config'

import {
  componentNameToClassName,
  componentNameToMacroName,
  componentPathToModuleName,
  packageResolveToPath,
  packageTypeToPath,
  packageNameToPath
} from './names.js'

describe('componentNameToClassName', () => {
  const components = [
    {
      name: 'button',
      className: 'Button'
    },
    {
      name: 'radios',
      className: 'Radios'
    },
    {
      name: 'skip-link',
      className: 'SkipLink'
    },
    {
      name: 'character-count',
      className: 'CharacterCount'
    }
  ]

  it.each(components)(
    "transforms component '$name' to class '$className'",
    ({ name, className }) => {
      expect(componentNameToClassName(name)).toBe(className)
    }
  )
})

describe('componentNameToMacroName', () => {
  const components = [
    {
      name: 'button',
      macroName: 'govukButton'
    },
    {
      name: 'radios',
      macroName: 'govukRadios'
    },
    {
      name: 'skip-link',
      macroName: 'govukSkipLink'
    },
    {
      name: 'character-count',
      macroName: 'govukCharacterCount'
    }
  ]

  it.each(components)(
    "transforms component '$name' to macro '$macroName'",
    ({ name, macroName }) => {
      expect(componentNameToMacroName(name)).toBe(macroName)
    }
  )
})

describe('componentPathToModuleName', () => {
  const components = [
    {
      path: 'components/button/button.mjs',
      moduleName: 'GOVUKFrontend.Button'
    },
    {
      path: 'components/radios/radios.mjs',
      moduleName: 'GOVUKFrontend.Radios'
    },
    {
      path: 'components/skip-link/skip-link.mjs',
      moduleName: 'GOVUKFrontend.SkipLink'
    },
    {
      path: 'components/character-count/character-count.mjs',
      moduleName: 'GOVUKFrontend.CharacterCount'
    }
  ]

  const others = ['common/index.mjs', 'common/normalise-dataset.mjs']

  it.each(components)(
    "transforms '$path' to '$moduleName'",
    ({ path, moduleName }) => {
      const srcPath = join(paths.package, 'src/govuk')

      // Path variations
      const pathAbsolute = join(srcPath, path)
      const pathRelativeToRoot = relative(paths.root, pathAbsolute)
      const pathRelativeToSource = relative(srcPath, pathAbsolute)

      // Absolute path
      // For example `/path/to/project/packages/govuk-frontend/src/govuk/components/button/button.mjs`
      expect(componentPathToModuleName(pathAbsolute)).toBe(moduleName)

      // Relative path (to project)
      // For example `packages/govuk-frontend/src/govuk/components/button/button.mjs`
      expect(componentPathToModuleName(pathRelativeToRoot)).toBe(moduleName)

      // Relative path (to source)
      // For example `components/button/button.mjs`
      expect(componentPathToModuleName(pathRelativeToSource)).toBe(moduleName)
    }
  )

  it.each(others)(
    "transforms unknown components to 'GOVUKFrontend'",
    (path) => {
      const srcPath = join(paths.package, 'src/govuk')

      // Path variations
      const pathAbsolute = join(srcPath, path)
      const pathRelativeToRoot = relative(paths.root, pathAbsolute)
      const pathRelativeToSource = relative(srcPath, pathAbsolute)

      // Unknown components always named 'GOVUKFrontend'
      expect(componentPathToModuleName(pathAbsolute)).toBe('GOVUKFrontend')
      expect(componentPathToModuleName(pathRelativeToRoot)).toBe(
        'GOVUKFrontend'
      )
      expect(componentPathToModuleName(pathRelativeToSource)).toBe(
        'GOVUKFrontend'
      )
    }
  )
})

describe('packageResolveToPath', () => {
  const packages = [
    {
      packageEntry: 'govuk-frontend/package.json',
      resolvedPath: join(paths.package, 'package.json')
    },
    {
      packageEntry: 'govuk-frontend/src/govuk/all.mjs',
      resolvedPath: join(paths.package, 'src/govuk/all.mjs')
    },
    {
      packageEntry: 'govuk-frontend/src/govuk/all.mjs',
      options: { modulePath: 'i18n.mjs' },
      resolvedPath: join(paths.package, 'src/govuk/i18n.mjs')
    },
    {
      packageEntry: 'govuk-frontend/src/govuk/all.mjs',
      options: { modulePath: 'components/accordion/accordion.mjs' },
      resolvedPath: join(
        paths.package,
        'src/govuk/components/accordion/accordion.mjs'
      )
    }
  ]

  it.each(packages)(
    "locates path for npm package entry '$packageEntry'",
    ({ packageEntry, options, resolvedPath }) => {
      expect(packageResolveToPath(packageEntry, options)).toBe(resolvedPath)
    }
  )
})

describe('packageTypeToPath', () => {
  const packages = [
    {
      packageName: 'govuk-frontend',
      resolvedPath: join(paths.package, 'dist/govuk/all.bundle.js')
    },
    {
      packageName: 'govuk-frontend',
      options: { type: 'module' },
      resolvedPath: join(paths.package, 'dist/govuk/all.mjs')
    },
    {
      packageName: 'govuk-frontend',
      options: { modulePath: 'i18n.mjs', type: 'module' },
      resolvedPath: join(paths.package, 'dist/govuk/i18n.mjs')
    },
    {
      packageName: 'govuk-frontend',
      options: { modulePath: 'components/accordion/accordion.bundle.js' },
      resolvedPath: join(
        paths.package,
        'dist/govuk/components/accordion/accordion.bundle.js'
      )
    },
    {
      packageName: 'govuk-frontend',
      options: {
        modulePath: 'components/accordion/accordion.bundle.mjs',
        type: 'module'
      },
      resolvedPath: join(
        paths.package,
        'dist/govuk/components/accordion/accordion.bundle.mjs'
      )
    }
  ]

  it.each(packages)(
    "locates path for npm package '$packageName' field '$packageField'",
    ({ packageName, options, resolvedPath }) => {
      expect(packageTypeToPath(packageName, options)).toBe(resolvedPath)
    }
  )
})

describe('packageNameToPath', () => {
  const packages = [
    {
      packageName: 'govuk-frontend',
      resolvedPath: paths.package
    },
    {
      packageName: 'govuk-frontend-review',
      resolvedPath: paths.app
    }
  ]

  it.each(packages)(
    "locates path for npm package '$packageName'",
    ({ packageName, resolvedPath }) => {
      expect(packageNameToPath(packageName)).toBe(resolvedPath)
    }
  )
})

describe("packageNameToPath (with custom 'node_module' paths)", () => {
  const packages = [
    {
      packageName: 'govuk-frontend',
      options: { moduleRoot: paths.root },
      resolvedPath: paths.package
    },
    {
      packageName: 'govuk-frontend-review',
      options: { moduleRoot: paths.root },
      resolvedPath: paths.app
    },
    {
      packageName: 'autoprefixer',
      options: { moduleRoot: paths.package },
      resolvedPath: join(paths.root, 'node_modules/autoprefixer')
    },
    {
      packageName: 'postcss',
      options: { moduleRoot: paths.app },
      resolvedPath: join(paths.root, 'node_modules/postcss')
    }
  ]

  it.each(packages)(
    "locates path for npm package '$packageName'",
    ({ packageName, options = {}, resolvedPath }) => {
      expect(packageNameToPath(packageName, options)).toBe(resolvedPath)
    }
  )
})
