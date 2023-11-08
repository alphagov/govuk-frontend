const { join } = require('path')

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
        // Note: Allow ES2015 for import/export syntax
        ecmaVersion: '2015',
        project: [join(__dirname, 'tsconfig.build.json')]
      },
      plugins: ['@typescript-eslint', 'es-x'],
      extends: [
        'plugin:@typescript-eslint/strict-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
        'plugin:es-x/restrict-to-es2015',
        'prettier'
      ],
      env: {
        browser: true
      },
      rules: {
        // Allow void return shorthand in arrow functions
        '@typescript-eslint/no-confusing-void-expression': [
          'error',
          {
            ignoreArrowShorthand: true
          }
        ],

        // Turn off known code suggestions until support is confirmed
        // e.g. Already supported ES2015+ features or via Babel transforms
        '@typescript-eslint/prefer-includes': 'off',
        '@typescript-eslint/prefer-nullish-coalescing': 'off',
        '@typescript-eslint/prefer-optional-chain': 'off',

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

        // ES modules include ES2017 'Object.entries()' coverage
        // https://browsersl.ist/#q=supports+es6-module+and+not+supports+object-entries
        'es-x/no-object-entries': 'off',

        // JSDoc blocks are mandatory in source code
        'jsdoc/require-jsdoc': [
          'error',
          {
            enableFixer: false,
            require: {
              ClassDeclaration: true,
              ClassExpression: true,
              FunctionExpression: true,
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
      files: ['src/govuk-prototype-kit/**/*.js'],
      parserOptions: {
        sourceType: 'module'
      },
      env: {
        browser: true
      },
      rules: {
        // Allow browser import `govuk-frontend.min.js`
        'n/no-missing-import': 'off'
      }
    }
  ]
}
