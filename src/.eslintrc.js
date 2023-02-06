module.exports = {
  overrides: [
    {
      files: ['**/*.{cjs,js,mjs}'],
      excludedFiles: ['**/*.test.{cjs,js,mjs}'],
      env: {
        browser: true
      },
      rules: {
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
      files: ['govuk/**/*.mjs'],
      excludedFiles: ['**/*.test.mjs'],
      parserOptions: {
        // Note: Allow ES6 for import/export syntax (although our code is ES3 for legacy browsers)
        ecmaVersion: '2015'
      },
      plugins: ['es-x'],
      extends: ['plugin:es-x/restrict-to-es3'],
      rules: {
        // Rollup transpiles modules to AMD export/define
        'es-x/no-modules': 'off',
        // Rollup plays fine with `export * from`
        'es-x/no-export-ns-from': 'off'
      }
    },
    {
      // Matches 'JavaScript component tests' in jest.config.mjs
      // to ignore unknown 'page' and 'browser' Puppeteer globals
      files: [
        '**/components/globals.test.mjs',
        '**/components/*/*.test.{js,mjs}'
      ],
      excludedFiles: [
        '**/(*.)?template.test.{js,mjs}',
        '**/*.unit.test.{js,mjs}'
      ],
      globals: {
        page: true,
        browser: true
      }
    }
  ]
}
