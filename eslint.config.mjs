import { fileURLToPath } from 'node:url'

import JSConfigs from '@eslint/js'
import MarkdownPlugin from '@eslint/markdown'
import { defineConfig, globalIgnores, includeIgnoreFile } from 'eslint/config'
import PrettierConfig from 'eslint-config-prettier'
import xoConfig from 'eslint-config-xo'
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
        version: '^24.22.3'
      }
    }
  },
  {
    extends: [
      ...xoConfig({
        space: true,
        semicolon: false,
        prettier: 'compat'
      })
    ],
    rules: {
      // The rules is stylistic and makes some arrow functions
      // less readable, even with its `as-needed` config,
      // so we'll leave it off and trust human eye
      'arrow-body-style': 'off',
      // Safari <15 does not support `Object.hasOwn` so we need
      // to keep using `Object.hasOwnProperty`
      // as Babel does not transpile it
      // https://caniuse.com/?search=Object.hasOwn
      'prefer-object-has-own': 'off',
      // We keep some static members (defaults, schema...)
      // at the end of our components to declutter the code
      'unicorn/consistent-class-member-order': 'off',
      // Accessing `data-` attributes through `dataset`
      // prevents copying the attribute from the HTML to search
      // the codebase
      'unicorn/dom-node-dataset': 'off'
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
      parser: TypescriptEslint.parser,
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
    },
    rules: {
      // Because of `describe` and `it`, we need to be
      // a bit looser on nesting in tests
      'max-nested-callbacks': 'off'
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
  },
  {
    // XO rules that our code breaks and we still need to review
    rules: {
      '@eslint-community/eslint-comments/require-description': 'off',
      '@html-eslint/head-order': 'off',
      '@html-eslint/require-meta-description': 'off',
      '@html-eslint/require-open-graph-protocol': 'off',
      '@html-eslint/sort-attrs': 'off',
      '@html-eslint/use-baseline': 'off',
      '@stylistic/lines-between-class-members': 'off',
      '@stylistic/padding-line-between-statements': 'off',
      camelcase: 'off',
      'default-case': 'off',
      'func-name-matching': 'off',
      'func-names': 'off',
      'guard-for-in': 'off',
      'import-x/no-anonymous-default-export': 'off',
      'import-x/no-unassigned-import': 'off',
      'max-depth': 'off',
      'max-params': 'off',
      'n/prefer-global/process': 'off',
      'n/prefer-process-get-builtin-module': 'off',
      'new-cap': 'off',
      'no-await-in-loop': 'off',
      'no-constructor-return': 'off',
      'no-implicit-globals': 'off',
      'no-lonely-if': 'off',
      'no-shadow': 'off',
      null: 'off',
      'package-json/consistent-path-prefix': 'off',
      'package-json/dependency-version-range': 'off',
      'package-json/no-exports-trailing-slash': 'off',
      'package-json/no-nested-exports': 'off',
      'package-json/no-orphan-types': 'off',
      'package-json/no-package-manager-engines': 'off',
      'package-json/no-redundant-files': 'off',
      'package-json/no-short-flags-in-scripts': 'off',
      'package-json/no-wildcard-dependencies': 'off',
      'package-json/prefer-engines-range': 'off',
      'package-json/prefer-exports': 'off',
      'package-json/prefer-shorthand': 'off',
      'package-json/prefer-side-effects-field': 'off',
      'package-json/prefer-type-module': 'off',
      'package-json/sort-dependencies': 'off',
      'package-json/sort-files': 'off',
      'package-json/sort-properties': 'off',
      'prefer-destructuring': 'off',
      radix: 'off',
      'regexp/letter-case': 'off',
      'regexp/no-super-linear-move': 'off',
      'regexp/no-unused-capturing-group': 'off',
      'regexp/no-useless-flag': 'off',
      'regexp/prefer-named-capture-group': 'off',
      'regexp/prefer-regexp-exec': 'off',
      'regexp/prefer-regexp-test': 'off',
      'regexp/strict': 'off',
      'require-unicode-regexp': 'off',
      'unicorn/import-style': 'off',
      'unicorn/logical-assignment-operators': 'off',
      'unicorn/max-nested-calls': 'off',
      'unicorn/name-replacements': 'off',
      'unicorn/new-for-builtins': 'off',
      'unicorn/no-anonymous-default-export': 'off',
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-array-sort': 'off',
      'unicorn/no-asterisk-prefix-in-documentation-comments': 'off',
      'unicorn/no-await-expression-member': 'off',
      'unicorn/no-computed-property-existence-check': 'off',
      'unicorn/no-declarations-before-early-exit': 'off',
      'unicorn/no-for-each': 'off',
      'unicorn/no-for-loop': 'off',
      'unicorn/no-global-object-property-assignment': 'off',
      'unicorn/no-incorrect-query-selector': 'off',
      'unicorn/no-incorrect-template-string-interpolation': 'off',
      'unicorn/no-lonely-if': 'off',
      'unicorn/no-negated-array-predicate': 'off',
      'unicorn/no-negated-condition': 'off',
      'unicorn/no-typeof-undefined': 'off',
      'unicorn/no-unnecessary-parameters': 'off',
      'unicorn/no-unsafe-string-replacement': 'off',
      'unicorn/no-useless-coercion': 'off',
      'unicorn/no-useless-else': 'off',
      'unicorn/no-useless-template-literals': 'off',
      'unicorn/numeric-separators-style': 'off',
      'unicorn/operator-assignment': 'off',
      'unicorn/prefer-add-event-listener-options': 'off',
      'unicorn/prefer-array-find': 'off',
      'unicorn/prefer-array-from-map': 'off',
      'unicorn/prefer-at': 'off',
      'unicorn/prefer-combined-guards': 'off',
      'unicorn/prefer-continue': 'off',
      'unicorn/prefer-default-parameters': 'off',
      'unicorn/prefer-dom-node-append': 'off',
      'unicorn/prefer-dom-node-html-methods': 'off',
      'unicorn/prefer-dom-node-remove': 'off',
      'unicorn/prefer-dom-node-replace-children': 'off',
      'unicorn/prefer-dom-node-text-content': 'off',
      'unicorn/prefer-early-return': 'off',
      'unicorn/prefer-export-from': 'off',
      'unicorn/prefer-global-this': 'off',
      'unicorn/prefer-iterator-to-array': 'off',
      'unicorn/prefer-location-assign': 'off',
      'unicorn/prefer-modern-dom-apis': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/prefer-native-coercion-functions': 'off',
      'unicorn/prefer-node-protocol': 'off',
      'unicorn/prefer-number-properties': 'off',
      'unicorn/prefer-object-iterable-methods': 'off',
      'unicorn/prefer-private-class-fields': 'off',
      'unicorn/prefer-query-selector': 'off',
      'unicorn/prefer-regexp-test': 'off',
      'unicorn/prefer-scoped-selector': 'off',
      'unicorn/prefer-set-has': 'off',
      'unicorn/prefer-single-call': 'off',
      'unicorn/prefer-spread': 'off',
      'unicorn/prefer-string-raw': 'off',
      'unicorn/prefer-string-repeat': 'off',
      'unicorn/prefer-string-replace-all': 'off',
      'unicorn/prefer-string-slice': 'off',
      'unicorn/prefer-switch': 'off',
      'unicorn/prefer-ternary': 'off',
      'unicorn/prefer-toggle-attribute': 'off',
      'unicorn/prefer-type-error': 'off',
      'unicorn/prefer-unicode-code-point-escapes': 'off',
      'unicorn/require-array-sort-compare': 'off',
      'unicorn/require-css-escape': 'off',
      'unicorn/require-number-to-fixed-digits-argument': 'off',
      'unicorn/single-line-block-comment-style': 'off',
      'unicorn/switch-case-braces': 'off',
      'unicorn/text-encoding-identifier-case': 'off',
      'unicorn/throw-new-error': 'off'
    }
  }
])
