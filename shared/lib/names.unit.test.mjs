import { join } from 'path'

import { paths } from '@govuk-frontend/config'

import {
  componentNameToClassName,
  componentNameToConfigName,
  componentNameToMacroName,
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

describe('componentNameToConfigName', () => {
  const components = [
    {
      name: 'button',
      configName: 'button'
    },
    {
      name: 'radios',
      configName: 'radios'
    },
    {
      name: 'skip-link',
      configName: 'skipLink'
    },
    {
      name: 'character-count',
      configName: 'characterCount'
    }
  ]

  it.each(components)(
    "transforms component '$name' to class '$configName'",
    ({ name, configName }) => {
      expect(componentNameToConfigName(name)).toBe(configName)
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
      packageName: '@govuk-frontend/review',
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
      packageName: '@govuk-frontend/review',
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
