import { join, relative } from 'path'

import config from '../config/index.js'

import {
  componentNameToClassName,
  componentNameToMacroName,
  componentPathToModuleName,
  packageNameToPath
} from './helper-functions.js'

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

  it.each(components)("transforms component '$name' to class '$className'", ({ name, className }) => {
    expect(componentNameToClassName(name))
      .toBe(className)
  })
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

  it.each(components)("transforms component '$name' to macro '$macroName'", ({ name, macroName }) => {
    expect(componentNameToMacroName(name))
      .toBe(macroName)
  })
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

  const others = [
    'common/index.mjs',
    'common/normalise-dataset.mjs',
    'vendor/polyfills/Document.mjs',
    'vendor/polyfills/Function/prototype/bind.mjs'
  ]

  it.each(components)("transforms '$path' to '$moduleName'", ({ path, moduleName }) => {
    const srcPath = join(config.paths.src, 'govuk')

    // Path variations
    const pathAbsolute = join(srcPath, path)
    const pathRelativeToRoot = relative(config.paths.root, pathAbsolute)
    const pathRelativeToSource = relative(srcPath, pathAbsolute)

    // Absolute path
    // For example `/path/to/project/src/govuk/components/button/button.mjs`
    expect(componentPathToModuleName(pathAbsolute))
      .toBe(moduleName)

    // Relative path (to project)
    // For example `src/govuk/components/button/button.mjs`
    expect(componentPathToModuleName(pathRelativeToRoot))
      .toBe(moduleName)

    // Relative path (to source)
    // For example `components/button/button.mjs`
    expect(componentPathToModuleName(pathRelativeToSource))
      .toBe(moduleName)
  })

  it.each(others)("transforms unknown components to 'GOVUKFrontend'", (path) => {
    const srcPath = join(config.paths.src, 'govuk')

    // Path variations
    const pathAbsolute = join(srcPath, path)
    const pathRelativeToRoot = relative(config.paths.root, pathAbsolute)
    const pathRelativeToSource = relative(srcPath, pathAbsolute)

    // Unknown components always named 'GOVUKFrontend'
    expect(componentPathToModuleName(pathAbsolute)).toBe('GOVUKFrontend')
    expect(componentPathToModuleName(pathRelativeToRoot)).toBe('GOVUKFrontend')
    expect(componentPathToModuleName(pathRelativeToSource)).toBe('GOVUKFrontend')
  })
})

describe('packageNameToPath', () => {
  const packages = [
    {
      name: 'html5shiv',
      path: join(config.paths.node_modules, 'html5shiv')
    },
    {
      name: 'govuk_template_jinja',
      path: join(config.paths.node_modules, 'govuk_template_jinja')
    },
    {
      name: 'govuk_frontend_toolkit',
      path: join(config.paths.node_modules, 'govuk_frontend_toolkit')
    },
    {
      name: 'jquery',
      path: join(config.paths.node_modules, 'jquery')
    }
  ]

  it.each(packages)("locates path for npm package '$name'", ({ name, path }) => {
    expect(packageNameToPath(name))
      .toBe(path)
  })
})
