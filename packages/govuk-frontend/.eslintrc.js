const { resolve } = require('path')

module.exports = {
  settings: {
    node: {
      version: '^18.12.0'
    }
  },
  overrides: [
    {
      files: ['src/govuk/**/*.mjs'],
      excludedFiles: ['**/*.test.mjs'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        // Note: Allow ES6 for import/export syntax
        ecmaVersion: '2015',
        project: [resolve(__dirname, 'tsconfig.json')]
      },
      plugins: [
        '@typescript-eslint',
        'es-x'
      ],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:es-x/restrict-to-es5'
      ],
      env: {
        browser: true
      },
      rules: {
        // Allow unknown `.prototype` members until ES6 classes
        '@typescript-eslint/no-unsafe-member-access': 'off',

        // Allow `this` alias until arrow functions supported
        '@typescript-eslint/no-this-alias': 'off',

        // Rollup transpiles modules into other formats
        'es-x/no-modules': 'off',

        // Allow `var` until let/const supported
        'no-var': 'off',

        // JSDoc blocks are mandatory
        'jsdoc/require-jsdoc': [
          'error', {
            enableFixer: false,
            require: {
              ClassDeclaration: true,
              ClassExpression: true,
              FunctionExpression: true,
              MethodDefinition: true
            }
          }
        ]
      }
    },
    {
      // Matches 'JavaScript component tests' in jest.config.mjs
      // to ignore unknown Jest Puppeteer globals
      files: [
        '**/components/globals.test.mjs',
        '**/components/*/*.test.{js,mjs}'
      ],
      excludedFiles: [
        '**/(*.)?template.test.{js,mjs}',
        '**/*.unit.test.{js,mjs}'
      ],
      globals: {
        page: 'readonly',
        browser: 'readonly',
        jestPuppeteer: 'readonly'
      }
    }
  ]
}
