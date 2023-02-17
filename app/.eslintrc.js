const { join } = require('path')

module.exports = {
  overrides: [
    {
      files: ['**/*.js'],
      excludedFiles: [
        '**/.eslintrc.js',
        '**/*.test.js'
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: [join(__dirname, 'tsconfig.json')]
      },
      plugins: ['@typescript-eslint']
    }
  ]
}
