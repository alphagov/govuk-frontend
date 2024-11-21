const { join } = require('path')

module.exports = (dirname) => ({
  overrides: [
    {
      files: ['**/*.mjs'],
      excludedFiles: ['**/*.test.mjs'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: [join(dirname, 'tsconfig.dev.json')]
      },
      plugins: ['@typescript-eslint']
    }
  ]
})
