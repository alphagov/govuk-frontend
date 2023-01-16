module.exports = {
  extends: 'standard',
  ignorePatterns: [
    '!.*',
    'dist/**/*',
    'node_modules',
    'node_modules/.*',
    'package-lock.json',
    'package/**/*',
    'public/**/*',
    'src/govuk/vendor/polyfills/**/*'
  ],
  overrides: [
    {
      extends: [
        'eslint:recommended',
        'plugin:import/recommended',
        'plugin:jsdoc/recommended',
        'plugin:n/recommended',
        'plugin:promise/recommended'
      ],
      files: ['**/*.{cjs,js,mjs}'],
      parserOptions: {
        ecmaVersion: 'latest'
      },
      plugins: [
        'import',
        'jsdoc',
        'n',
        'promise'
      ],
      rules: {
        // Check import or require statements are A-Z ordered
        'import/order': [
          'error',
          {
            alphabetize: { order: 'asc' },
            'newlines-between': 'always'
          }
        ],

        // JSDoc blocks are optional
        'jsdoc/require-jsdoc': 'off',
        'jsdoc/require-param-description': 'off',
        'jsdoc/require-param': 'off',

        // Require hyphens before param description
        // Aligns with TSDoc style: https://tsdoc.org/pages/tags/param/
        'jsdoc/require-hyphen-before-param-description': 'warn',

        // Check for valid formatting
        'jsdoc/check-line-alignment': 'warn',
        'jsdoc/check-syntax': 'error',

        // Add unknown @jest-environment tag name
        'jsdoc/check-tag-names': [
          'warn', {
            definedTags: ['jest-environment']
          }
        ],

        // Add missing .querySelectorAll() type
        'jsdoc/no-undefined-types': [
          'error', {
            definedTypes: ['NodeListOf']
          }
        ]
      },
      settings: {
        jsdoc: {
          // Allows us to use type declarations that exist in our dependencies
          mode: 'typescript'
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
      files: ['**/govuk/components/**/*.{cjs,js,mjs}'],
      excludedFiles: ['**/govuk/components/**/*.test.{cjs,js,mjs}'],
      parserOptions: {
        // Note: Allow ES6 for import/export syntax (although our code is ES3 for legacy browsers)
        ecmaVersion: '2015'
      }
    },
    {
      files: ['**/*.test.{cjs,js,mjs}'],
      env: {
        jest: true
      }
    }
  ],
  root: true
}
