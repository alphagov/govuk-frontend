import { fileURLToPath } from 'node:url'

import JSConfigs from '@eslint/js'
import MarkdownPlugin from '@eslint/markdown'
import TypescriptParser from '@typescript-eslint/parser'
import { defineConfig, globalIgnores, includeIgnoreFile } from 'eslint/config'
import PrettierConfig from 'eslint-config-prettier'
import ESXPlugin from 'eslint-plugin-es-x'
import { configs as ImportXConfigs } from 'eslint-plugin-import-x'
import JestPlugin from 'eslint-plugin-jest'
import JestDomPlugin from 'eslint-plugin-jest-dom'
import { configs as JSDocConfigs } from 'eslint-plugin-jsdoc'
import NodePlugin from 'eslint-plugin-n'
import PromisePlugin from 'eslint-plugin-promise'
import globals from 'globals'
import TypescriptEslint from 'typescript-eslint'

const gitignorePaths = [
  fileURLToPath(new URL('.gitignore', import.meta.url)),
  fileURLToPath(new URL('packages/govuk-frontend/.gitignore', import.meta.url))
]

export default defineConfig([
  includeIgnoreFile(gitignorePaths, { gitignoreResolution: true }),
  globalIgnores([
    // Ignore committed built files
    'dist/*',

    // Prevent CHANGELOG history changes
    'CHANGELOG.md'
  ]),
  {
    // Configure the version of Node.JS
    // to override the `engines` field
    // of the `govuk-frontend` package
    settings: {
      node: {
        version: '^24.22.0'
      }
    }
  },
  {
    extends: [
      JSConfigs.configs.recommended,
      ImportXConfigs['flat/recommended'],
      JSDocConfigs['flat/recommended-typescript-flavor'],
      NodePlugin.configs['flat/recommended'],
      PromisePlugin.configs['flat/recommended']
    ],
    files: [
      '**/*.{cjs,js,mjs}',

      // Check markdown `*.md` contains valid code blocks
      // https://github.com/eslint/eslint-plugin-markdown#advanced-configuration
      '**/*.md/*.{cjs,js,mjs}'
    ],
    // Replicate standard's environment set up
    languageOptions: {
      parser: TypescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      },
      globals: {
        ...globals.browser
      }
    },
    rules: {
      // Access import namespace (e.g. GOVUKFrontend) using string keys
      'import-x/namespace': [
        'error',
        {
          allowComputed: true
        }
      ],

      // Check import or require statements are A-Z ordered
      'import-x/order': [
        'error',
        {
          alphabetize: { order: 'asc' },
          'newlines-between': 'always'
        }
      ],

      // Check for valid formatting
      'jsdoc/check-line-alignment': [
        'warn',
        'never',
        {
          wrapIndent: '  '
        }
      ],

      // JSDoc blocks can use `@preserve` to prevent removal
      'jsdoc/check-tag-names': [
        'warn',
        {
          definedTags: ['preserve']
        }
      ],

      // JSDoc blocks are optional by default
      'jsdoc/require-jsdoc': 'off',

      // JSDoc @param required in (optional) blocks but
      // @param description is not necessary by default
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-param': 'error',

      // Require hyphens before param description
      // Aligns with TSDoc style: https://tsdoc.org/pages/tags/param/
      'jsdoc/require-hyphen-before-param-description': 'warn',

      // Maintain new line after description
      'jsdoc/tag-lines': [
        'warn',
        'never',
        {
          startLines: 1
        }
      ],

      // Ignore `govuk-frontend` exports as they require auto-generated files
      'import-x/no-unresolved': ['error', { ignore: ['govuk-frontend'] }],
      'n/no-missing-import': ['error', { allowModules: ['govuk-frontend'] }],
      'n/no-missing-require': ['error', { allowModules: ['govuk-frontend'] }],

      // Automatically use template strings
      'no-useless-concat': 'error',
      'prefer-template': 'error',

      // Flow control – avoid continue and else blocks after return statements
      // in if statements
      'no-continue': 'error',
      'no-else-return': 'error',

      // Avoid hard to read multi assign statements
      'no-multi-assign': 'error',

      // Deviations from ESLint's recommended config that standard implements
      // that our code relies on
      'no-unused-vars': ['error', { args: 'none' }],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-new': 'error'
    },
    settings: {
      jsdoc: {
        // Allows us to use type declarations that exist in our dependencies
        mode: 'typescript',
        tagNamePreference: {
          // TypeDoc doesn't understand '@abstract' but '@virtual'
          abstract: 'virtual'
        }
      }
    }
  },
  {
    // Extensions required for ESM import
    files: ['**/*.mjs'],
    rules: {
      'import-x/extensions': [
        'error',
        'always',
        {
          ignorePackages: true,
          pattern: {
            cjs: 'always',
            js: 'always',
            mjs: 'always'
          }
        }
      ]
    }
  },
  {
    files: ['**/*.test.{cjs,js,mjs}'],
    extends: [
      JestPlugin.configs['flat/style'],
      JestDomPlugin.configs['flat/recommended']
    ],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    }
  },
  {
    // Matches Puppeteer environment in jest.config.mjs
    // to ignore unknown Jest Puppeteer globals
    files: ['**/*.puppeteer.test.{js,mjs}'],
    languageOptions: {
      globals: {
        page: 'readonly',
        browser: 'readonly',
        jestPuppeteer: 'readonly'
      }
    }
  },
  {
    extends: [MarkdownPlugin.configs.recommended],
    files: ['**/*.md'],
    processor: 'markdown/markdown'
  },
  {
    extends: [TypescriptEslint.configs.disableTypeChecked],
    files: ['**/*.md/*.{cjs,js,mjs}']
  },
  {
    files: [
      '**/coding-standards/component-options.md/*.{cjs,js,mjs}',
      '**/coding-standards/js.md/*.{cjs,js,mjs}'
    ],
    rules: {
      // Ignore unused example code
      'no-new': 'off',
      'no-undef': 'off',
      'no-unused-expressions': 'off',
      'no-unused-vars': 'off',
      'no-useless-constructor': 'off',

      // Ignore paths to example modules
      'import-x/no-unresolved': 'off',
      'n/no-missing-import': 'off'
    }
  },
  {
    files: ['packages/govuk-frontend/src/govuk/**/*.mjs'],
    ignores: ['**/*.test.mjs'],
    languageOptions: {
      globals: {
        ...globals.browser
      },
      parserOptions: {
        // Note: Allow ES2015 for import/export syntax
        ecmaVersion: '2015'
      }
    },
    extends: [
      TypescriptEslint.configs.strictTypeChecked,
      TypescriptEslint.configs.stylisticTypeChecked,
      ESXPlugin.configs['flat/restrict-to-es2015']
    ],
    rules: {
      // Allow void return shorthand in arrow functions
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        {
          ignoreArrowShorthand: true
        }
      ],

      // Check type support for template string implicit `.toString()`
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowBoolean: true,
          allowNumber: true
        }
      ],

      // Babel transpiles ES2020 class fields
      'es-x/no-class-fields': 'off',

      // Babel transpiles ES2022 class instance fields
      'es-x/no-class-instance-fields': 'off',

      // Babel transpiles ES2022 class static fields
      'es-x/no-class-static-fields': 'off',

      // Babel transpiles optional catch binding
      'es-x/no-optional-catch-binding': 'off',

      // ES modules include ES2016 '[].includes()' coverage
      // https://browsersl.ist/#q=supports+es6-module+and+not+supports+array-includes
      'es-x/no-array-prototype-includes': 'off',

      // Babel transpiles ES2020 `??` nullish coalescing
      'es-x/no-nullish-coalescing-operators': 'off',

      // ES modules include ES2017 'Object.entries()' coverage
      // https://browsersl.ist/#q=supports+es6-module+and+not+supports+object-entries
      'es-x/no-object-entries': 'off',

      // Babel transpiles ES2020 optional chaining
      'es-x/no-optional-chaining': 'off',

      // JSDoc blocks are mandatory in source code
      'jsdoc/require-jsdoc': [
        'error',
        {
          enableFixer: false,
          require: {
            ClassDeclaration: true,
            ClassExpression: true,
            FunctionExpression: false,
            MethodDefinition: true
          }
        }
      ],

      // JSDoc @param required in (mandatory) blocks but
      // @param description is necessary in source code
      'jsdoc/require-param-description': 'warn',
      'jsdoc/require-param': 'error'
    }
  },
  {
    // Apply to everything, including tests
    files: ['packages/govuk-frontend/src/govuk/**/*.{cjs,js,mjs}'],
    rules: {
      // Don't import govuk-frontend in the project itself
      'no-restricted-imports': ['error', 'govuk-frontend'],

      // Fix collisions between APIs that are
      // - still experimental in Node
      // - but stable in browsers
      'n/no-unsupported-features/node-builtins': [
        'error',
        {
          ignores: ['sessionStorage']
        }
      ]
    }
  },
  {
    extends: [TypescriptEslint.configs.disableTypeChecked],
    files: ['packages/govuk-frontend/src/govuk-prototype-kit/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser
      },
      parserOptions: {
        sourceType: 'module'
      }
    },
    rules: {
      // Allow browser import `govuk-frontend.min.js`
      'n/no-missing-import': 'off'
    }
  },
  {
    files: ['shared/helpers/jest/**/*.{cjs,js,mjs}'],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    }
  },
  {
    extends: [PrettierConfig]
  }
])
