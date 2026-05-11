import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { includeIgnoreFile } from '@eslint/compat'
import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginESx from 'eslint-plugin-es-x'
import importPlugin from 'eslint-plugin-import'
import jest from 'eslint-plugin-jest'
import jestDom from 'eslint-plugin-jest-dom'
import jsdoc from 'eslint-plugin-jsdoc'
import markdown from 'eslint-plugin-markdown'
import globals from 'globals'
import neostandard, { plugins as neostandardPlugins } from 'neostandard'
import tseslint from 'typescript-eslint'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default tseslint.config(
  // Honour `.gitignore` and replace the previous `--ignore-path .gitignore`
  // CLI flag which was removed in ESLint v9
  includeIgnoreFile(join(__dirname, '.gitignore')),

  {
    ignores: [
      '**/dist/**',
      '**/vendor/**',
      '**/node_modules/**',

      // Prevent CHANGELOG history changes
      'CHANGELOG.md'
    ]
  },

  // Base configs applied to all matching files
  ...neostandard({ noStyle: true }),
  eslintConfigPrettier,

  // Enable markdown processor on `.md` files so JS code blocks get linted
  ...markdown.configs.recommended,

  {
    name: 'govuk-frontend/main',
    files: [
      '**/*.{cjs,js,mjs}',

      // Check markdown `*.md` contains valid code blocks
      // https://github.com/eslint/eslint-plugin-markdown#advanced-configuration
      '**/*.md/*.{cjs,js,mjs}'
    ],
    plugins: {
      import: importPlugin,
      jsdoc,
      jest,
      'jest-dom': jestDom
    },
    languageOptions: {
      ecmaVersion: 'latest',
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        projectService: true,
        tsconfigRootDir: __dirname
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      ...importPlugin.flatConfigs.recommended.rules,
      ...jest.configs['flat/style'].rules,
      ...jestDom.configs['flat/recommended'].rules,
      ...jsdoc.configs['flat/recommended-typescript-flavor'].rules,
      ...neostandardPlugins.n.configs['flat/recommended'].rules,
      ...neostandardPlugins.promise.configs['flat/recommended'].rules,

      // Check import or require statements are A-Z ordered
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc' },
          'newlines-between': 'always'
        }
      ],

      // Access import namespace (e.g. GOVUKFrontend) using string keys
      'import/namespace': [
        'error',
        {
          allowComputed: true
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
      'import/no-unresolved': ['error', { ignore: ['govuk-frontend'] }],
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
      'no-multi-assign': 'error'
    },
    settings: {
      jsdoc: {
        // Allows us to use type declarations that exist in our dependencies
        mode: 'typescript',
        tagNamePreference: {
          // TypeDoc doesn't understand '@abstract' but '@virtual'
          abstract: 'virtual'
        }
      },
      n: {
        // `eslint-plugin-n` v17+ defaults to Node >= 4.2.0 when no `engines`
        // field is found in the nearest `package.json`. Pin to our minimum
        // supported Node version so dev tooling lints cleanly.
        version: '>=22.17.0'
      }
    }
  },

  {
    // Extensions required for ESM import
    files: ['**/*.mjs'],
    rules: {
      'import/extensions': [
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
    // `eslint-plugin-import`'s default resolver doesn't fully understand
    // package.json `exports` so it can't resolve flat config helper packages
    files: ['eslint.config.mjs'],
    rules: {
      'import/no-unresolved': 'off'
    }
  },

  {
    files: ['**/*.test.{cjs,js,mjs}', '**/helpers/jest/**/*.js'],
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

  // Disable type-aware lint rules in markdown code blocks because they have
  // no TypeScript program
  {
    files: ['**/*.md/*.{cjs,js,mjs}'],
    ...tseslint.configs.disableTypeChecked
  },

  {
    files: [
      '**/coding-standards/component-options.md/*.{cjs,js,mjs}',
      '**/coding-standards/js.md/*.{cjs,js,mjs}'
    ],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    },
    rules: {
      // Ignore unused example code
      'no-new': 'off',
      'no-undef': 'off',
      'no-unused-expressions': 'off',
      'no-unused-vars': 'off',
      'no-useless-constructor': 'off',

      // Ignore paths to example modules
      'import/no-unresolved': 'off',
      'n/no-missing-import': 'off'
    }
  },

  // ---------------------------------------------------------------------------
  // packages/govuk-frontend — source files (type-checked, ES2015 restricted)
  // ---------------------------------------------------------------------------
  {
    files: ['packages/govuk-frontend/src/govuk/**/*.mjs'],
    ignores: ['**/*.test.mjs'],
    plugins: {
      'es-x': pluginESx
    },
    languageOptions: {
      globals: {
        ...globals.browser
      },
      parserOptions: {
        // Note: Allow ES2015 for import/export syntax
        ecmaVersion: 2015
      }
    },
    rules: {
      // Browser globals (e.g. `sessionStorage`, `CustomEvent`) are flagged as
      // unsupported by `eslint-plugin-n` even when running in browsers
      'n/no-unsupported-features/node-builtins': 'off'
    },
    settings: {
      node: {
        version: '^18.12.0'
      }
    }
  },

  ...tseslint.config({
    files: ['packages/govuk-frontend/src/govuk/**/*.mjs'],
    ignores: ['**/*.test.mjs'],
    extends: [
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      pluginESx.configs['flat/restrict-to-es2015']
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
  }),

  // ---------------------------------------------------------------------------
  // packages/govuk-frontend — Prototype Kit browser modules (no type-checking)
  // ---------------------------------------------------------------------------
  {
    files: ['packages/govuk-frontend/src/govuk-prototype-kit/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser
      },
      parserOptions: {
        // These files are not included in any TypeScript project so disable
        // type-aware parsing for them
        projectService: false,
        project: null,
        sourceType: 'module'
      }
    },
    rules: {
      // Allow browser import `govuk-frontend.min.js`
      'n/no-missing-import': 'off',
      // Browser globals (e.g. `window`) are flagged as unsupported by
      // `eslint-plugin-n` even when running in browsers
      'n/no-unsupported-features/node-builtins': 'off'
    }
  },

  // ---------------------------------------------------------------------------
  // Puppeteer browser test files use browser-side `evaluate` callbacks that
  // reference window globals such as `sessionStorage`
  // ---------------------------------------------------------------------------
  {
    files: ['**/*.puppeteer.test.{js,mjs}'],
    rules: {
      'n/no-unsupported-features/node-builtins': 'off'
    }
  }
)
