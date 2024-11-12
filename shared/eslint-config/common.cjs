// import js from '@eslint/js'
// import eslintConfigPrettier from 'eslint-config-prettier'
// import importPlugin from 'eslint-plugin-import'
// import jest from 'eslint-plugin-jest'
// import jestDom from 'eslint-plugin-jest-dom'
// import jsDoc from 'eslint-plugin-jsdoc'
// import markdown from 'eslint-plugin-markdown'
// import globals from "globals";
// import neostandard, { plugins } from 'neostandard'

const js = require('@eslint/js');
const eslintConfigPrettier = require('eslint-config-prettier')
const importPlugin = require('eslint-plugin-import')
const jest = require('eslint-plugin-jest')
const jestDom = require('eslint-plugin-jest-dom')
const jsDoc = require('eslint-plugin-jsdoc')
const markdown = require('eslint-plugin-markdown')
const globals = require("globals")
const { neostandard, plugins } = require('neostandard');

const commonConfig = [
  {
    plugins: {
      import: importPlugin,
      jsdoc: jsDoc,
      jest,
      'jest-dom': jestDom,
      markdown,
    }
  },
  ...neostandard({ noStyle: true }),
  eslintConfigPrettier,
  ...markdown.configs.recommended,
  {
    ignores: [
      '**/.cache/**',
      '**/dist/**',
      '**/vendor/**',

      // Enable dotfile linting
      '!.*',
      'node_modules',
      'node_modules/.*',

      // Prevent CHANGELOG history changes
      'CHANGELOG.md'
    ]
  },
  {
    ...js.configs.recommended,
    ...importPlugin.flatConfigs.recommended,
    ...jest.configs['flat/style'],
    ...jestDom.configs['flat/recommended'],
    ...jsDoc.configs['flat/recommended-typescript-flavor'],
    ...plugins.n.configs['flat/recommended'],
    ...plugins.promise.configs['flat/recommended'],
    files: [
      '**/*.{cjs,js,mjs}',

      // Check markdown `*.md` contains valid code blocks
      // https://github.com/eslint/eslint-plugin-markdown#advanced-configuration
      '**/*.md/*.{cjs,js,mjs}'
    ],
    languageOptions: {
      globals: {
        ...globals.browser
      },
      parserOptions: {
        ecmaVersion: 'latest'
      },
    },
    rules: {
      // Check import or require statements are A-Z ordered
      'import/order': [
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
    files: ['**/*.test.{cjs,js,mjs}','**/helpers/jest/*.js'],
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
        ...globals.browser,
        page: 'readonly',
        // page: 'readonly',
        browser: 'readonly',
        jestPuppeteer: 'readonly'
      }
    }
  }, 
  {
    files: [
      '**/coding-standards/component-options.md/*.{cjs,js,mjs}',
      '**/coding-standards/js.md/*.{cjs,js,mjs}'
    ],
    languageOptions: {
      globals: {
        browser: true
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
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json'
      }
    }    
  }
]

module.exports = {
  commonConfig
}
